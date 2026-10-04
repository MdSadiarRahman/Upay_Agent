/**
 * Production Relational Database Schema Suggestion for UpayPulse AI (PostgreSQL / Cloud SQL)
 */

export const DATABASE_SCHEMA_DDL = `
-- 1. USERS & ROLES TABLE
CREATE TABLE mfs_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'agent', 'merchant', 'operator')),
    kyc_tier VARCHAR(20) DEFAULT 'Tier 1',
    is_verified BOOLEAN DEFAULT FALSE,
    zone_cluster_id VARCHAR(50) DEFAULT 'DINAJPUR-SADAR-04',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AGENT LIQUIDITY & FLOAT ACCOUNTS
CREATE TABLE mfs_agents (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES mfs_users(id),
    shop_name VARCHAR(150) NOT NULL,
    physical_cash_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    e_float_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    shortage_risk_percent NUMERIC(5, 2) DEFAULT 0.00,
    reliability_score NUMERIC(5, 2) DEFAULT 95.00,
    operating_status VARCHAR(20) DEFAULT 'active'
);

-- 3. HOURLY TELEMETRY & PREDICTIVE CACHE
CREATE TABLE agent_liquidity_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) REFERENCES mfs_agents(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    predicted_4h_demand NUMERIC(12, 2) NOT NULL,
    expected_shortage NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    queue_wait_minutes INT DEFAULT 0
);

-- 4. LIQUIDITY REBALANCING AUDIT TRAIL
CREATE TABLE rebalancing_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_agent_id VARCHAR(50) REFERENCES mfs_agents(id),
    donor_agent_id VARCHAR(50) REFERENCES mfs_agents(id),
    recommended_amount NUMERIC(12, 2) NOT NULL,
    partner_score NUMERIC(5, 2) NOT NULL,
    supervisor_approver_id UUID REFERENCES mfs_users(id),
    approval_status VARCHAR(20) CHECK (approval_status IN ('pending', 'approved', 'settled', 'cancelled')),
    audit_hash VARCHAR(64) UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MERCHANT PROFILE & HYPERLOCAL CAMPAIGNS
CREATE TABLE mfs_merchants (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES mfs_users(id),
    business_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    upay_qr_active BOOLEAN DEFAULT TRUE,
    avg_ticket_size NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE merchant_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id VARCHAR(50) REFERENCES mfs_merchants(id),
    title VARCHAR(200) NOT NULL,
    discount_type VARCHAR(20) CHECK (discount_type IN ('flat', 'percentage', 'cashback', 'bundle')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_purchase NUMERIC(10, 2) NOT NULL,
    target_window VARCHAR(50) NOT NULL,
    cost_cap NUMERIC(10, 2) NOT NULL,
    margin_safety_score NUMERIC(5, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ZERO-CASH TRANSACTIONS & FRAUD QUEUE
CREATE TABLE customer_zero_cash_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES mfs_users(id),
    total_spend NUMERIC(12, 2) NOT NULL,
    cashout_fee_saved NUMERIC(10, 2) NOT NULL,
    merchant_discount_saved NUMERIC(10, 2) NOT NULL,
    settled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fraud_anomaly_review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_identifier VARCHAR(100) NOT NULL,
    anomaly_type VARCHAR(50) NOT NULL,
    risk_score NUMERIC(5, 2) NOT NULL,
    description TEXT NOT NULL,
    review_status VARCHAR(20) DEFAULT 'under_review',
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agents_coords ON mfs_agents(latitude, longitude);
CREATE INDEX idx_rebalance_hash ON rebalancing_ledger(audit_hash);
`;
