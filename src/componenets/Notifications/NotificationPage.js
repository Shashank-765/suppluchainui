import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NotificationPage.module.css';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [notifyToggle, setNotifyToggle] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/notify/getallnotifications`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notify/notified?notificationId=${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [notifyToggle]);

    const notificationHandler = (batch) => {
        markAsRead(batch?._id);
        navigate('/batchprogress', { state: { batch } })
    }

    const handleDelete = async (id) => {
        try {
            const deletednoti = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notify/deletenotification?id=${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (deletednoti) {
                setNotifyToggle(!notifyToggle)
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>All Notifications</h2>
            <ul className={styles.notificationList}>
                {notifications.length === 0 ? (
                    <p className={styles.noNotifications}>No notifications found.</p>
                ) : (
                    notifications.map((note, index) => (
                        <li key={index} onClick={() => notificationHandler(note)} className={styles.notificationItem}>
                            <div className={styles.notificationContent}>
                                <div className={styles.message}>
                                    <strong>Batch ID:</strong> {note.batchId} <br />
                                    {note.message || 'New Notification'}
                                </div>
                                <div className={styles.date}>
                                    {new Date(note.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <button className={styles.deleteButton} onClick={() => handleDelete(note._id)}>
                                ❌
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default NotificationPage;
