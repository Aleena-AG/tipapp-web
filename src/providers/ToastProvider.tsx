import React from 'react';
import {  toast, Toaster } from 'react-hot-toast';

class ToastProvider extends React.Component {
    static success(message : string) {
        toast.success(message);
    }

    static error(message : string) {
        toast.error(message);
    }

    static loading(message : string) {
        toast.loading(message);
    }

    static custom(message : string) {
        toast(message);
    }

    render() {
        return <Toaster />;
    }
}

export default ToastProvider;
