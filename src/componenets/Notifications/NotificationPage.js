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
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [hasMore, setHasMore] = useState(true);


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

    const fetchNotifications = async (isLoadMore = false) => {
        try {
            setIsCircularLoader(true);
            const res = await api.get(`/notify/getallnotifications`, {
                params: {
                    skip: isLoadMore ? skip : 0,
                    limit,
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            const fetched = res.data;
            if (fetched.length < limit) {
                setHasMore(false);
            }
            setNotifications(prev =>
                isLoadMore ? [...prev, ...fetched] : fetched
            );
            setSkip(prev => isLoadMore ? prev + limit : limit);
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
        fetchNotifications(false);
    }, [notifyToggle]);
    const notificationHandler = (batch) => {
        markAsRead(batch?._id);
        navigate('/batchprogress', { state: { batch } })
    }

    // const handleDelete = async (id) => {
    //     try {
    //         const deletednoti = await api.post(`/notify/deletenotification?id=${id}`, {}, {
    //             headers: {
    //                 Authorization: `Bearer ${user?.token}`,
    //             },
    //         });
    //         if (deletednoti) {
    //             setNotifyToggle(!notifyToggle)
    //         }
    //     } catch (err) {
    //         console.error('Failed to delete notification:', err);
    //     }
    // };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>All Notifications</h2>
            <ul className={styles.notificationList}>
                {notifications.length === 0 ? (
                    <p className={styles.noNotifications}> {isCircularloader ? <CircularLoader size={20} /> : 'No notifications found.'}</p>
                ) : (
                    notifications.map((note, index) => (
                        <li key={index} onClick={() => notificationHandler(note)} className={styles.notificationItem}>
                            <div className={styles.notificationContent}>
                                <div className={styles.message}>
                                    <strong>{ `${note?.message==='Product sold' ?'':`A new batch has been successfully created for  ${note?.coffeeType}`}`}This batch has been assigned the unique identification number  {note.batchId}</strong>  <br />
                                    {note?.message === 'Product sold' ? `This batch has been sold with quantity ${note.quantity} and price ${note.price}`
                                        : ' You can now proceed to track, manage, or update its status as required.'}
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
                {hasMore && notifications.length > 0 && (
                    <button className={styles.loadMoreButton} onClick={() => fetchNotifications(true)}>
                        {isCircularloader ? <CircularLoader size={20} /> : 'See More'}
                    </button>
                )}

            </ul>
        </div>
    );
};

export default NotificationPage;
