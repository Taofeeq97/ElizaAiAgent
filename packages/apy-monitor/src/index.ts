// packages/apy-monitor/src/index.ts
import { z } from "zod";

/**
 * APY Monitoring Plugin for Eliza
 */
const apyMonitorPlugin = {
  name: "apy-monitor",
  version: "0.1.0",
  description: "APY monitoring and fund reallocation",
  
  // Tools provided by this plugin
  tools: [
    {
      name: "reallocate_funds",
      displayName: "Reallocate Funds",
      description: "Transfer funds from one pool to another to maximize APY returns",
      
      schema: z.object({
        fromPool: z.string().describe("The source pool to withdraw funds from"),
        toPool: z.string().describe("The destination pool to deposit funds into"),
        amount: z.number().optional().describe("The amount to transfer (if omitted, transfers all funds)"),
        expectedApyGain: z.number().describe("The expected APY gain after the transfer (percentage points)")
      }),
      
      async execute(params, context) {
        const { fromPool, toPool, amount, expectedApyGain } = params;
        const { logger } = context;
        
        logger.info(`Reallocating funds from ${fromPool} to ${toPool} for ${expectedApyGain}% APY gain`);
        
        try {
          // Placeholder implementation
          return {
            success: true,
            txHash: "0x" + Math.random().toString(16).substring(2, 42),
            newPosition: {
              pool: toPool,
              amount: amount || 1000,
              apy: 5.5 + expectedApyGain
            }
          };
        } catch (error) {
          logger.error("Failed to reallocate funds", error);
          return {
            success: false
          };
        }
      }
    }
  ],

  tasks: [
    {
      name: "monitor_apy",
      displayName: "Monitor APY Rates",
      description: "Periodically checks APY rates across pools and reallocates funds when profitable",
      
      schedule: "*/30 * * * *",
      
      plannerPrompt: `
        You are a financial agent tasked with optimizing yield across multiple pools.
        
        Every 30 minutes, scan available pools and compare APYs. If a better pool exists and the gas-adjusted APY delta exceeds the threshold, call reallocate_funds().
        
        Steps to follow:
        1. Retrieve current positions and balances
        2. Fetch current APY rates for all compatible pools
        3. Calculate potential gains after accounting for gas costs and minimums
        4. If potential gain > threshold (default 0.5%), execute reallocation
        5. Log the decision and results
        
        Always consider:
        - Gas costs of transactions
        - Minimum deposit requirements
        - Pool stability and risks
        - Historical APY volatility
        
        Only reallocate if the expected annualized gain exceeds $50 or 0.5% of the position value.
      `,
      
      async execute({ agent, logger }) {
        logger.info("Running APY monitoring task");
        
        try {
          // Get access to the planner functionality
          const planner = agent.getPlanner();
          
          // Run the planner with our financial optimization prompt
          const result = await planner.plan("Check if we should reallocate funds based on APY changes");
          
          logger.info("APY monitoring task completed", { result });
          return { success: true };
        } catch (error) {
          logger.error("APY monitoring task failed", error);
          return { success: false, error: String(error) };
        }
      }
    }
  ],
  
  
  async onStart({ logger }) {
    logger.info("APY Monitor plugin started");
    return true;
  }
};

export default apyMonitorPlugin;