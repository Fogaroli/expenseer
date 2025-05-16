# Frontend Implementation description

The Expenseer frontend application was fully developed using React. The interface was designed to be simple and intuitive with direct access to the information expected to be mostly used by the users.

## Storage

Data are stored in multiple formats. User information and JWT are stored in Redux, in an authentication slice.
Additionally Budget and Category names are added to Redux as these are used by multiple components.

Remainder information are stored in state variable within the component where it is used.

## Custom Hooks

Three custom hooks were created to avoid duplication and to isolate API async code from the react component code. This provides flexibility to re-use code int eh future as well as provide an easier maintenance scheme.

## Style

The application was completely designed using Material UI elements, with a focus to use on mobile devices.

## Missing Features

Some features, although being part of the initial design have not being implemented yet, the list below summarizes the next initiative in the application evolution.

- Ability to reset password;
- Ability to update user password;
- Allow user to completely delete their account and their data.
- Add dashboards for different types of budgets.
- Administrator access to allow adding and editing users and setting another user as admin.
- Incorporate alterative registration/login methods not only username and password.
