interface FormatUserName {
  user: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
  };
  option?: 'short' | 'long';
}

export const formatUserName = (value: FormatUserName) => {
  const {user, option} = value;
  const {firstName, lastName, middleName} = user;
  if (option === 'short') {
    return `${firstName} ${lastName}`;
  }
  return `${firstName} ${middleName} ${lastName}`;
};
