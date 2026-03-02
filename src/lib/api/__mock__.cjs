// Manual mock for @/lib/api
const apiClient = {
    get: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    post: jest.fn(() => Promise.resolve({ data: { data: {} } })),
};

const tokenizeCard = jest.fn(() => Promise.resolve({
    id: 'tok_test_123',
    created_at: '2024-01-01',
    brand: 'VISA',
    name: 'Test Card',
    last_four: '1111',
    exp_year: '25',
    exp_month: '12',
    card_holder: 'TEST USER',
    status: 'CREATED',
}));

const getAcceptanceToken = jest.fn(() => Promise.resolve('acc_token_test'));

module.exports = { apiClient, tokenizeCard, getAcceptanceToken };
