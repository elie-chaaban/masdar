import {store, ReactNotificationOptions} from 'react-notifications-component';

export interface ErrorNotification {
  response: {
    status: number;
    statusText: string;
  };
}

export const successNotification = (message: string, type: ReactNotificationOptions['type'] = 'success') => {
  store.addNotification({
    title: type === 'default' ? 'Welcome' : type,
    message: message,
    type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['fadeInRight'],
    animationOut: ['fadeOutRight'],
    dismiss: {
      duration: 3000,
      onScreen: true,
      showIcon: true
    }
  });
};

export const errorNotification = (error: ErrorNotification) => {
  const {response} = error;
  if (error.response) {
    if (response.status !== 401 && response.statusText) {
      if (response.status === 500) {
        store.addNotification({
          title: `Server Error`,
          message: 'Something went Wrong!',
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeInRight'],
          animationOut: ['animated', 'fadeOutRight'],
          dismiss: {
            duration: 5000,
            onScreen: true,
            showIcon: true
          }
        });
      } else {
        store.addNotification({
          title: `${response.status} Error `,
          message: response.statusText,
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeInRight'],
          animationOut: ['animated', 'fadeOutRight'],
          dismiss: {
            duration: 5000,
            onScreen: true,
            showIcon: true
          }
        });
      }
    }
  }
};
