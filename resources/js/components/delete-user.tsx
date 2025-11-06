import React, { useState } from 'react';

interface DeleteUserProps {
    onDelete: (password: string) => void;
    onCancel: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ onDelete, onCancel }) => {
    const [password, setPassword] = useState('');

    const handleDelete = () => {
        onDelete(password);
        setPassword('');
    };

    return (
        <div className="delete-user">
            <h3 className="delete-user__header">Delete Account</h3>
            <p className="delete-user__description">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Please enter your password to confirm
                you would like to permanently delete your account.
            </p>
            <div className="delete-user__form">
                <div className="delete-user__input-group">
                    <label htmlFor="password" className="delete-user__label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="delete-user__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="delete-user__actions">
                    <button
                        onClick={onCancel}
                        className="delete-user__button delete-user__button--secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="delete-user__button delete-user__button--destructive"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;
