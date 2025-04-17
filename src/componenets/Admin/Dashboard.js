import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import edit from '../../Imges/edit (1).png'
import view from '../../Imges/eye.png'
import block from '../../Imges/prohibition.png'
import unblock from '../../Imges/unlocked.png'
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBatchTerm, setSearchBatchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isBlocked, setIsBlocked] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [usersPerPage] = useState(7);
    const [totalPages, setTotalPages] = useState(0);
    const [totalBatchPage, setTotalBatchPage] = useState(0);
    const [allBatch, setAllBatch] = useState([]);
    const [currnetBatchPage, setCurrentBatchPage] = useState(1);
    const [roles, setRoles] = useState([]);

    const [allUser, setAllUser] = useState([]);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        role: '',
    });


    const HandleBatchviewPage = (batch) => {
    console.log(batch);
        navigate('/batchprogress')
    }

    const handleUserChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role') {
            const selected = roles.find(role => role.key === value);
            if (selected) {
                setUserForm((prev) => ({
                    ...prev,
                    role: {
                        slug: selected.key,
                        label: selected.name,
                        className: selected.className
                    }
                }));
            }
        } else {
            setUserForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedQr, setSelectedQr] = useState(null);

    const openQrModal = (qr) => {
        setSelectedQr(qr);
        setQrModalOpen(true);
    };

    const closeQrModal = () => {
        setQrModalOpen(false);
        setSelectedQr(null);
    };

    const [formData, setFormData] = useState({
        farmerRegNo: "",
        farmerName: "",
        farmerAddress: "",
        farmInspectionName: "",
        harvesterName: "",
        processorName: "",
        exporterName: "",
        importerName: "",
        coffeeType: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/users/createBatch", formData);

            console.log("Saved successfully:", res.data);
            setShowBatchModal(false); // close modal
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Failed to save:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error("No response received:", error.request);
            } else {
                // Something else happened
                console.error("Error submitting form:", error.message);
            }
        }

    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        // Example POST request
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', userForm);
            if (response.data) {
                console.log('User created!');
                setShowUserModal(false);
                setUserForm({
                    name: '',
                    email: '',
                    password: '',
                    contact: '',
                    role: ''
                });
            } else {
                console.error('Failed to create user');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const edithandler = (user) => {
        navigate('/edituser', { state: { user } });
    }

    const blockhandler = async (user) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/users/blockUser?id=${user._id}`);
            if (response.data) {
                // console.log('User blocked successfully!',response?.data?.user?.isBlocked);
                showSuccess('User Blocked Succefully')
                setIsBlocked(response?.data?.user?.isBlocked);
                setToggle(!toggle);
            } else {
                console.error('Failed to block user');
                showError('Failed to block user');
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            showError('Error blocking user');
        }
    }

    const unblockhandler = async (user) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/users/unblockUser?id=${user?._id}`,);
            if (response.data) {
                // console.log('User unblocked successfully!',response?.data?.user?.isBlocked);
                showSuccess('User unblocked successfully!');
                setIsBlocked(response?.data?.user?.isBlocked);
                setToggle(!toggle);
            } else {
                console.error('Failed to unblock user');
                showError('Failed to unblock user');
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    }

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };


    const handlePreviousBatchPage = () => {
        setCurrentBatchPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNextBatchPage = () => {
        setCurrentBatchPage((prev) => Math.min(prev + 1, totalBatchPage));
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const handleSearchBatchChange = (e) => {
        setSearchBatchTerm(e.target.value);
        setCurrentBatchPage(1);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/fetchalluser', {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm,
                },
            });
            setAllUser(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchbatch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/getBatch', {
                params: {
                    page: currnetBatchPage,
                    limit: usersPerPage,
                    search: searchBatchTerm,
                },
            });
            setAllBatch(response.data.batches);
            setTotalBatchPage(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching batches:', error);

        }

    }
    useEffect(() => {
        fetchbatch();
    }, [currnetBatchPage, searchBatchTerm, showBatchModal]);


    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, showUserModal, toggle]);

    const fetchRoles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/getRoles');
            if (res.data?.roles) {
                setRoles(res.data?.roles);
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);
    const roleMap = {
        FARM_INSPECTION: {
            name: 'Farm Inspection',
            className: `${styles.label} ${styles.info}`,
        },
        HARVESTER: {
            name: 'Harvester',
            className: `${styles.label} ${styles.success}`,
        },
        EXPORTER: {
            name: 'Exporter',
            className: `${styles.label} ${styles.warning}`,
        },
        IMPORTER: {
            name: 'Importer',
            className: `${styles.label} ${styles.danger}`,
        },
        PROCESSOR: {
            name: 'Processor',
            className: `${styles.label} ${styles.primary}`,
        },
    };


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>Admin Dashboard</h2>
            </div>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Users</h3>
                    <p className={styles.counter}>0</p>
                </div>
                <div className={styles.card}>
                    <h3>Total Roles</h3>
                    <p className={styles.counter}>5</p>
                </div>
                <div className={styles.card}>
                    <h3>Total Batches</h3>
                    <p className={styles.counter}>0</p>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Batches Overview</h3>
                    <div className={styles.sectionHeader}>
                        <input
                            type="text"
                            placeholder="Search Batches By ID..."
                            value={searchBatchTerm}
                            onChange={handleSearchBatchChange}
                            className={styles.searchInput}
                        />
                        <button className={styles.primaryBtn} onClick={() => setShowBatchModal(true)}>
                            Create Batch
                        </button>
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>QR Code</th>
                            <th>Coffee Type</th>
                            <th>Farm Inspector</th>
                            <th>Harvester</th>
                            <th>Exporter</th>
                            <th>Importer</th>
                            <th>Processor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBatch?.length > 0 ? (
                            allBatch.map((batch, index) => (
                                <tr key={index}>
                                    <td>{batch.batchId}</td>
                                    <td>
                                        {batch.qrCode ? (
                                            <img
                                                src={batch.qrCode}
                                                alt="QR Code"
                                                width="60"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => openQrModal(batch.qrCode)}
                                            />
                                        ) : (
                                            '---'
                                        )}
                                    </td>
                                    <td>{batch.coffeeType}</td>
                                    <td>{batch.farmInspectionName}</td>
                                    <td>{batch.harvesterName}</td>
                                    <td>{batch.exporterName}</td>
                                    <td>{batch.importerName}</td>
                                    <td>{batch.processorName}</td>
                                    <td>
                                        <button onClick={() => HandleBatchviewPage(batch)} className={styles.editButton}>
                                            <img src={view} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className={styles.centerText}>
                                    No Batches Found
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {/* QR Modal */}
                    {qrModalOpen && (
                        <div className={styles.qrModalOverlay} onClick={closeQrModal}>
                            <div className={styles.qrModal} onClick={(e) => e.stopPropagation()}>
                                <img src={selectedQr} alt="Full QR Code" className={styles.qrModalImg} />
                                <button onClick={closeQrModal} className={styles.closeBtn}>×</button>
                            </div>
                        </div>
                    )}
                </table>
                <div className={styles.pagination}>
                    <button onClick={handlePreviousBatchPage} disabled={currnetBatchPage === 1}>
                        ◀
                    </button>
                    <span>
                        Page {currnetBatchPage} of {totalBatchPage}
                    </span>
                    <button onClick={handleNextBatchPage} disabled={currnetBatchPage === totalBatchPage}>
                        ▶
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Users</h3>
                    <div className={styles.sectionHeader}>
                        <input
                            type="text"
                            placeholder="Search user..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        <button className={styles.primaryBtn} onClick={() => setShowUserModal(true)}>
                            Create User
                        </button>
                    </div>
                </div>
                <div className={styles.usersGrid}>
                    <div className={styles.rolesCard}>
                        <h3 className={styles.boxTitle}>User Roles</h3>
                        <div className={styles.tableResponsive}>
                            <table className={styles.rolesTable}>
                                <thead>
                                    <tr>
                                        <th>Role Name</th>
                                        <th>Role Slug</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role) => (
                                        <tr key={role._id}>
                                            <td>{role.name}</td>
                                            <td>
                                                <span className={
                                                    role.className
                                                        .split(' ')
                                                        .map(cn => styles[cn])
                                                        .join(' ')
                                                }>
                                                    {role.key}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                        </div>
                    </div>
                    <div className={styles.usersTableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Wallet Address</th>
                                    <th>Name</th>
                                    <th>Contact No.</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUser?.length > 0 ? (
                                    allUser.map((user, index) => (
                                        <tr key={index}>
                                            <td style={{
                                                maxWidth: '70px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {user.walletAddress}
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.contact}</td>
                                            <td>
                                                {user.role && (
                                                    <span
                                                        className={
                                                            user.role.className
                                                                .split(' ')
                                                                .map(cn => styles[cn])
                                                                .join(' ')
                                                        }
                                                    >
                                                        {user.role.label}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <button onClick={() => edithandler(user)} className={styles.editButton}><img src={edit} /></button>
                                                {
                                                    !user?.isBlocked ? (
                                                        <button onClick={() => blockhandler(user)} className={styles.editButton}><img src={unblock} /></button>
                                                    ) : (
                                                        <button onClick={() => unblockhandler(user)} className={styles.editButton}><img src={block} /></button>
                                                    )}

                                                <button className={styles.editButton}><img src={view} /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className={styles.centerText}>No Users Found</td></tr>
                                )}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                ◀
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                ▶
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showBatchModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Add Batch</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="farmerRegNo"
                                placeholder="Farmer Reg No"
                                required
                                value={formData.farmerRegNo}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="farmerName"
                                placeholder="Farmer Name"
                                required
                                value={formData.farmerName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="coffeeType"
                                placeholder="cofeeType"
                                required
                                value={formData.coffeeType}
                                onChange={handleChange}
                            />
                            <textarea
                                name="farmerAddress"
                                placeholder="Farmer Address"
                                required
                                value={formData.farmerAddress}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="farmInspectionName"
                                placeholder="Farm Inspection Name"
                                required
                                value={formData.farmInspectionName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="harvesterName"
                                placeholder="Harvester Name"
                                required
                                value={formData.harvesterName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="processorName"
                                placeholder="Processor Name"
                                required
                                value={formData.processorName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="exporterName"
                                placeholder="Exporter Name"
                                required
                                value={formData.exporterName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="importerName"
                                placeholder="Importer Name"
                                required
                                value={formData.importerName}
                                onChange={handleChange}
                            />
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowBatchModal(false)}>Cancel</button>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUserModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Add User</h2>
                        <form onSubmit={handleUserSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={userForm.name}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={userForm.email}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                value={userForm.password}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="text"
                                name="contact"
                                placeholder="Contact No."
                                value={userForm.contact}
                                onChange={handleUserChange}
                                required
                            />
                            <select
                                value={userForm.role?.slug || ''}
                                name="role"
                                onChange={handleUserChange}
                            >
                                <option value="" disabled>Select a role</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role.key}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>


                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowUserModal(false)}>Cancel</button>
                                <button type="submit">Submit</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
