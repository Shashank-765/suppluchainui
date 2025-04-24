import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import edit from '../../Imges/edit (1).png'
import view from '../../Imges/eye.png'
import deleteimage from '../../Imges/delete.png'
import block from '../../Imges/prohibition.png'
import unblock from '../../Imges/unlocked.png'
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';

const Dashboard = () => {
    const navigate = useNavigate();
    const popupRef = useRef(null);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBatchTerm, setSearchBatchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isBlocked, setIsBlocked] = useState(false);
    const [toatalUser, setTotalUser] = useState(0);
    const [totalRoles, setTotalRoles] = useState(0);
    const [totalBatch, setTotalBatch] = useState(0);
    const [toggle, setToggle] = useState(false);
    const [usersPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(0);
    const [totalBatchPage, setTotalBatchPage] = useState(0);
    const [allBatch, setAllBatch] = useState([]);
    const [currnetBatchPage, setCurrentBatchPage] = useState(1);
    const [roles, setRoles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const qrImageRef = useRef(null);



    const [allUser, setAllUser] = useState([]);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        role: '',
    });


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleEditToggle(); // close popup if click outside
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);


    const handleSave = async () => {
        try {

            const response = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/updateprofile', edituserdata)
            if (response?.data) {
                setIsEditing(false);
                setToggle(!toggle);
                showSuccess('Profile updated!');
            }
        } catch (error) {
            setIsEditing(true);
            showError('Failed to update profile')
        }

    };
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const HandleBatchviewPage = (batch) => {
        console.log(batch);
        navigate('/batchprogress', { state: { batch } });
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
            const res = await axios.post("https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/createBatch", formData);

            console.log("Saved successfully:", res.data);
            setShowBatchModal(false); // close modal
            setFormData({
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
            const response = await axios.post('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/createuser', userForm);
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

    const [edituserdata,setedituserdata]=useState({ name: '', email: '', userType: '', address: '', contact: '' })

    const edithandler = (edituser) => {
    setedituserdata({
      name:edituser?.name,
      email:edituser?.email,
      userType:edituser?.userType,
      address:edituser?.address,
      contact:edituser?.contact
    })
        setIsEditing(!isEditing);
    }
    const userview = (userdata) => {
        navigate('/userdashboard', { state: { userdata } });
    }

    const blockhandler = async (user) => {
        try {
            const response = await axios.post(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/blockUser?id=${user._id}`);
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
            const response = await axios.post(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/unblockUser?id=${user?._id}`,);
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
            const response = await axios.get('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/fetchalluser', {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm,
                },
            });
            console.log(response.data, 'response.data')
            setAllUser(response.data.allUsers);
            setTotalPages(response.data.totalPages);
            setTotalUser(response.data.totalUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const downloadQrImage = () => {
        const imageElement = qrImageRef.current;
        if (!imageElement) return;
        const imageURL = imageElement.src;

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const fetchbatch = async () => {
        try {
            const response = await axios.get('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getBatch', {
                params: {
                    page: currnetBatchPage,
                    limit: usersPerPage,
                    search: searchBatchTerm,
                },
            });
            setAllBatch(response.data.batches);
            setTotalBatch(response.data.totalBatches);
            setTotalBatchPage(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching batches:', error);

        }

    }
      const handleeditChange = (e) => {
        const { name, value } = e.target;
        setedituserdata((prev) => ({ ...prev, [name]: value }));
    };

    const deleteBatch = async (id) => {
        try {
            const response = await axios.delete(`https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/deletebatch?batchId=${id}`)
            if (response?.data) {
                setToggle(!toggle);
                showSuccess("Batch deleted succefully")
            }
        } catch (error) {
            console.log(error)
            showError("failed to delte batch")
        }
    }
    useEffect(() => {
        fetchbatch();
    }, [currnetBatchPage, searchBatchTerm, showBatchModal, toggle]);


    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, showUserModal, toggle]);

    const fetchRoles = async () => {
        try {
            const res = await axios.get('https://lfgkx3p7-5000.inc1.devtunnels.ms/api/users/getRoles');
            if (res.data?.roles) {
                setRoles(res.data?.roles);
                setTotalRoles(res?.data?.totalCount)
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>Admin Dashboard</h2>
            </div>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Users</h3>
                    <p className={styles.counter}>{toatalUser}</p>
                </div>
                <div className={styles.card}>
                    <h3>Total Roles</h3>
                    <p className={styles.counter}>{totalRoles}</p>
                </div>
                <div className={styles.card}>
                    <h3>Total Batches</h3>
                    <p className={styles.counter}>{totalBatch}</p>
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
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Batch ID</th>
                                <th>QR Code</th>
                                <th>Food Type</th>
                                <th>Farm Inspector</th>
                                <th>Harvester</th>
                                <th>Importer</th>
                                <th>Exporter</th>
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
                                                    width="40"
                                                    margin='0'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => openQrModal(batch.qrCode)}
                                                />
                                            ) : (
                                                '---'
                                            )}
                                        </td>
                                        <td>{batch.coffeeType}</td>
                                        <td>
                                            {/* {batch?.farmInspectionName} */}

                                            {

                                                (batch?.tracking?.isInspexted) ? <button
                                                    className={styles.completeBtn}
                                                >Complete</button> :
                                                    (!batch?.tracking?.isInspexted) ?
                                                        <button className={styles.progressBtn}>
                                                            Progress</button>
                                                        :
                                                        <button className={styles.pendingBtn}>
                                                            Pending
                                                        </button>

                                            }

                                            {/* <button className={styles.verifyBtn}>✅</button> */}
                                        </td>
                                        <td>
                                            {/* {batch?.harvesterName} */}
                                            {

                                                (batch?.tracking?.isHarvested) ? <button
                                                    className={styles.completeBtn}
                                                >Complete</button> :


                                                    (batch?.tracking?.isInspexted) ?
                                                        <button className={styles.progressBtn}>
                                                            Progress</button>
                                                        :
                                                        <button className={styles.pendingBtn}>
                                                            Pending
                                                        </button>


                                            }
                                        </td>
                                        <td>
                                            {/* {batch?.importerName} */}
                                            {

                                                (batch?.tracking?.isImported) ? <button
                                                    className={styles.completeBtn}
                                                >Complete</button> :
                                                    (batch?.tracking?.isHarvested) ?
                                                        <button className={styles.progressBtn}>
                                                            Progress</button>
                                                        :
                                                        <button className={styles.pendingBtn}>
                                                            Pending
                                                        </button>

                                            }
                                        </td>
                                        <td>
                                            {/* {batch?.exporterName} */}
                                            {

                                                (batch?.tracking?.isExported) ? <button
                                                    className={styles.completeBtn}
                                                >Complete</button> :
                                                    (batch?.tracking?.isImported) ?
                                                        <button className={styles.progressBtn}>
                                                            Progress</button>
                                                        :
                                                        <button className={styles.pendingBtn}>
                                                            Pending
                                                        </button>

                                            }
                                        </td>
                                        <td>
                                            {/* {batch?.processorName} */}
                                            {

                                                (batch?.tracking?.isProcessed) ? <button
                                                    className={styles.completeBtn}
                                                >Complete</button> :
                                                    (batch?.tracking?.isExported) ?
                                                        <button className={styles.progressBtn}>
                                                            Progress</button>
                                                        :
                                                        <button className={styles.pendingBtn}>
                                                            Pending
                                                        </button>
                                            }
                                        </td>
                                        <td>
                                            <button onClick={() => HandleBatchviewPage(batch)} className={styles.editButton}>
                                                <img src={view} />
                                            </button>
                                            <button onClick={() => deleteBatch(batch.batchId)} className={styles.deleteButton}>
                                                <img src={deleteimage} />
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
                                    <img
                                        ref={qrImageRef}
                                        src={selectedQr}
                                        alt="Full QR Code"
                                        className={styles.qrModalImg}
                                    />
                                    <button onClick={closeQrModal} className={styles.closeBtn}>×</button>
                                    <button onClick={downloadQrImage} className={styles.qrDownloadButton}>
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}


                    </table>
                </div>

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
                    <div className={styles.usersTableWrapper1}>
                        <div className={styles.tableheader}>
                            <h3>Users</h3>
                            <div className={styles.sectionHeader1}>
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
                                                <td>
                                                    {user.walletAddress
                                                        ? `${user.walletAddress.slice(0, 4)}......${user.walletAddress.slice(-4)}`
                                                        : ''}
                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.contact}</td>
                                                <td>
                                                    {user.role ? (
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
                                                    ):' -----'}
                                                </td>
                                                <td>
                                                    <button onClick={() => edithandler(user)} className={styles.editButton}><img src={edit} /></button>
                                                    {
                                                        !user?.isBlocked ? (
                                                            <button onClick={() => blockhandler(user)} className={styles.editButton}><img src={unblock} /></button>
                                                        ) : (
                                                            <button onClick={() => unblockhandler(user)} className={styles.editButton}><img src={block} /></button>
                                                        )}

                                                    <button onClick={() => userview(user)} className={styles.editButton}><img src={view} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className={styles.centerText}>No Users Found</td></tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
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
                                placeholder="Food Type"
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
                            <select
                                value={formData.farmInspectionName}
                                name="farmInspectionName"
                                onChange={handleChange}
                                style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                            >
                                <option value="" disabled >Select a farmInspection Name</option>
                                {allUser.map((user) => (
                                    user?.role?.label === 'Farm Inspection' && (<option key={user._id} style={{ color: "black" }}>
                                        {user?.role?.label === 'Farm Inspection' && user?.name}
                                    </option>)
                                ))}
                            </select>
                            <select
                                value={formData.harvesterName}
                                name="harvesterName"
                                onChange={handleChange}
                                style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                            >
                                <option value="" disabled>Select a harvesterName Name</option>
                                {allUser.map((user) => (
                                    (user?.role?.label === 'Harvester' && <option key={user._id} style={{ color: "black" }}>
                                        {user?.role?.label === 'Harvester' && user?.name}
                                    </option>)
                                ))}
                            </select>
                            <select
                                value={formData.processorName}
                                name="processorName"
                                onChange={handleChange}
                                style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                            >
                                <option value="" disabled>Select a processorName Name</option>
                                {allUser.map((user) => (
                                    (user?.role?.label === 'Processor' && <option key={user._id} style={{ color: "black" }}>
                                        {user?.role?.label === 'Processor' && user?.name}
                                    </option>)
                                ))}
                            </select>
                            <select
                                value={formData.exporterName}
                                name="exporterName"
                                onChange={handleChange}
                                style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                            >
                                <option value="" disabled>Select a exporterName Name</option>
                                {allUser.map((user) => (
                                    (user?.role?.label === 'Exporter' && <option key={user._id} style={{ color: "black" }}>
                                        {user?.role?.label === 'Exporter' && user?.name}
                                    </option>)
                                ))}
                            </select>
                            <select
                                value={formData.importerName}
                                name="importerName"
                                onChange={handleChange}
                                style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                            >
                                <option value="" disabled>Select a importerName Name</option>
                                {allUser.map((user) => (
                                    (user?.role?.label === 'Importer' && <option key={user._id} style={{ color: "black" }}>
                                        {user?.role?.label === 'Importer' && user?.name}
                                    </option>)
                                ))}
                            </select>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowBatchModal(false)}>Cancel</button>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="profile-edit-form">
                    <div className="editformcontianer" ref={popupRef}>
                        <label>
                            Name:
                            <input type="text" name="name" value={edituserdata.name} onChange={handleeditChange} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={edituserdata.email} onChange={handleeditChange} disabled />
                        </label>
                        <label>
                            Contact:
                            <input type="number" className={styles.contactnumber} name="contact" value={edituserdata.contact} onChange={handleeditChange} />
                        </label>
                        <label>
                            Address:
                            <input type="text" name="address" value={edituserdata.address} onChange={handleeditChange} />
                        </label>
                        {(edituserdata?.userType !== 'user' && edituserdata?.userType !== 'admin') ? (
                            <label>
                                User Type:
                                <select
                                    name="userType"
                                    className="authtext"
                                    value={edituserdata.userType}
                                    onChange={handleeditChange}
                                    required
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="retailer">Retailer</option>
                                </select>
                            </label>
                        ) : null}

                        <button onClick={handleSave} className="profile-save-btn">Save</button>
                        <button onClick={handleEditToggle} className="profile-cancel-btn">Cancel</button>
                    </div>
                </div>
            ) : null}

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
