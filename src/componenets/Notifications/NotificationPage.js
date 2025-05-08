import React, { useEffect, useState } from 'react';
import api from '../../axios'
import styles from './NotificationPage.module.css';
import CircularLoader from '../CircularLoader/CircularLoader'
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [notifyToggle, setNotifyToggle] = useState(false);
    const [isCircularloader, setIsCircularLoader] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    function formatNotificationDate(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffMs = now - createdDate;

        if (diffMs < 0) {
            const futureDiff = createdDate - now;
            const futureDays = Math.floor(futureDiff / (1000 * 60 * 60 * 24));
            return futureDays <= 1 ? 'Tomorrow' : createdDate.toLocaleDateString();
        }

        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        if (diffSec < 60) {
            return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
        }

        if (diffMin < 60) {
            return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        }

        if (diffHr < 24) {
            return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
        }

        if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }

        return createdDate.toLocaleDateString();
    }

    const fetchNotifications = async () => {
        try {
            setIsCircularLoader(true);
            const res = await api.get(
                `/notify/getallnotifications`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setNotifications(res.data);
            setIsCircularLoader(false);

        } catch (err) {
            setIsCircularLoader(false);
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notify/notified?notificationId=${id}`, {}, {
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
            const deletednoti = await api.post(`/notify/deletenotification?id=${id}`, {}, {
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
                    <p className={styles.noNotifications}> { isCircularloader ? <CircularLoader size={20}/> :'No notifications found.'}</p>
                ) : (
                    notifications.map((note, index) => (
                        <li key={index} onClick={() => notificationHandler(note)} className={styles.notificationItem}>
                            <div className={styles.notificationContent}>
                                <div className={styles.message}>
                                    <strong>A new batch has been successfully created for  {note?.coffeeType}.This batch has been assigned the unique identification number  {note.batchId}</strong>  <br />
                                    You can now proceed to track, manage, or update its status as required.
                                    <br />
                                    {note.message || 'New Notification'}
                                </div>
                                <div className={styles.date}>
                                    {formatNotificationDate(note.createdAt)}
                                </div>
                            </div>
                            {/* <button className={styles.deleteButton} onClick={() => handleDelete(note._id)}>
                                ❌
                            </button> */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default NotificationPage;
