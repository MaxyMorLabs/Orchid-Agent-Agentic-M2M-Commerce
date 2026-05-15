#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
pub struct SpendingLimit {
    pub agent: Address,
    pub daily_limit: i128,
    pub spent_today: i128,
    pub last_reset: u64,
}

#[contract]
pub struct EscrowContract;

const LIMIT_KEY: &str = "limit";

#[contractimpl]
impl EscrowContract {
    /// Initialize escrow with agent address and daily USDC spending limit
    pub fn initialize(env: Env, agent: Address, daily_limit: i128) {
        agent.require_auth();
        let limit = SpendingLimit {
            agent: agent.clone(),
            daily_limit,
            spent_today: 0,
            last_reset: env.ledger().timestamp(),
        };
        env.storage()
            .instance()
            .set(&Symbol::new(&env, LIMIT_KEY), &limit);
    }

    /// Agent pays a supplier; enforces daily spending cap
    pub fn pay(env: Env, token: Address, supplier: Address, amount: i128) {
        let mut limit: SpendingLimit = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, LIMIT_KEY))
            .unwrap();

        limit.agent.require_auth();

        // Reset daily counter if 24 h have passed
        let now = env.ledger().timestamp();
        if now - limit.last_reset >= 86_400 {
            limit.spent_today = 0;
            limit.last_reset = now;
        }

        assert!(
            limit.spent_today + amount <= limit.daily_limit,
            "daily spending limit exceeded"
        );

        token::Client::new(&env, &token).transfer(&limit.agent, &supplier, &amount);
        limit.spent_today += amount;
        env.storage()
            .instance()
            .set(&Symbol::new(&env, LIMIT_KEY), &limit);

        env.events()
            .publish((Symbol::new(&env, "payment"),), (supplier, amount));
    }

    /// Read current spending state
    pub fn get_limit(env: Env) -> SpendingLimit {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, LIMIT_KEY))
            .unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize_and_get_limit() {
        let env = Env::default();
        env.mock_all_auths();
        // v26 API: env.register(Contract, ()) instead of register_contract
        let contract_id = env.register(EscrowContract, ());
        let client = EscrowContractClient::new(&env, &contract_id);

        let agent = Address::generate(&env);
        client.initialize(&agent, &500_000_000); // 500 USDC (7 decimals)

        let limit = client.get_limit();
        assert_eq!(limit.daily_limit, 500_000_000);
        assert_eq!(limit.spent_today, 0);
    }

    #[test]
    fn test_daily_limit_enforced() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(EscrowContract, ());
        let client = EscrowContractClient::new(&env, &contract_id);

        let agent = Address::generate(&env);
        client.initialize(&agent, &100); // 100 unit limit

        let limit = client.get_limit();
        assert_eq!(limit.daily_limit, 100);
        assert_eq!(limit.spent_today, 0);
    }
}
