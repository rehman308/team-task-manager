export default function validateForm(...data) {
  const errors = {};

  if (data.name?.length < 5 || data.name?.length > 25) {
    errors.name = 'Username must be between 5 and 25 characters';
  }

  if (!data.email?.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (data.password?.length < 6 || data.password?.length > 12) {
    errors.password = 'Password must be between 6 and 12 characters';
  }

  if (errors.name || errors.email || errors.password) {
    return { name: errors.name, email: errors.email, password: errors.password };
  } else {
    return { status: false };
  }
}
