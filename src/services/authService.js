import api from './api';

const USERS_KEY = 'app_registered_users';

const TEST_CREDENTIALS = [
  { id: 'test_1', email: 'eve.holt@reqres.in', password: 'cityslicka', name: 'Eve Holt' },
  { id: 'test_2', email: 'charles.morris@reqres.in', password: 'pistol', name: 'Charles Morris' },
];

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const makeToken = (email) => `tok_${btoa(email).replace(/=/g, '')}_${Date.now()}`;

const authService = {
  register: async ({ name, email, password }) => {
    const users = getStoredUsers();
    const normalizedEmail = email.toLowerCase().trim();
    const alreadyExists = users.find((u) => u.email === normalizedEmail);
    if (alreadyExists) throw new Error('EMAIL_TAKEN');

    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([...users, newUser]);

    return {
      token: makeToken(normalizedEmail),
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
  },

  login: async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();

    const storedUsers = getStoredUsers();
    const storedUser = storedUsers.find((u) => u.email === normalizedEmail);
    if (storedUser) {
      if (storedUser.password !== password) throw new Error('INVALID_CREDENTIALS');
      return {
        token: makeToken(normalizedEmail),
        user: { id: storedUser.id, email: storedUser.email, name: storedUser.name },
      };
    }

    try {
      const response = await api.post('/login', { email: normalizedEmail, password });
      const testMatch = TEST_CREDENTIALS.find((c) => c.email === normalizedEmail);
      return {
        token: response.data.token,
        user: { id: response.data.id || null, email: normalizedEmail, name: testMatch?.name || null },
      };
    } catch (error) {
      const isKeyError =
        error.response?.data?.error === 'missing_api_key' ||
        error.response?.data?.message?.includes('x-api-key') ||
        error.response?.status === 401;

      if (isKeyError) {
        const testUser = TEST_CREDENTIALS.find(
          (c) => c.email === normalizedEmail && c.password === password
        );
        if (!testUser) throw new Error('INVALID_CREDENTIALS');
        return {
          token: makeToken(normalizedEmail),
          user: { id: testUser.id, email: testUser.email, name: testUser.name },
        };
      }

      throw error;
    }
  },
};

export default authService;
