export const validateInput = (inputName, state) => {
    const { email, password, firstName, lastName, address, phoneNumber, errors } = state;

    switch (inputName) {
        case 'email':
            if (email && email.trim() === '') {
                errors.email = 'Email is required';
            } else if (!email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                errors.email = 'Invalid email format';
            }
            break;
        case 'password':
            if (!password || password.trim() === '') {
                errors.password = 'Password is required';
            } else if (password && !password.trim().match(/^.{6,}$/)) {
                errors.password = 'Password must be at least 6 characters';
            }
            break;
        case 'firstName':
            if (!firstName || firstName.trim() === '') {
                errors.firstName = 'First name is required';
            }
            break;
        case 'lastName':
            if (!lastName || lastName.trim() === '') {
                errors.lastName = 'Last name is required';
            }
            break;
        case 'address':
            if (!address || address.trim() === '') {
                errors.address = 'Address is required';
            }
            break;
        case 'phoneNumber':
            if (!phoneNumber || phoneNumber.trim() === '') {
                errors.phoneNumber = 'Phone number is required';
            } else if (phoneNumber && !phoneNumber.trim().match(/^(0)[0-9]{9,10}$/)) {
                errors.phoneNumber = 'Invalid phone number format';
            }
            break;
        default:
            break;
    }
    return errors;
};

export const isRequired = (value) => {
    return value && value.trim() !== '';
};
