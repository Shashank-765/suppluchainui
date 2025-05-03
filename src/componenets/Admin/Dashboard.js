import React, { useRef, useEffect, useState } from 'react';
import api from '../../axios'
import edit from '../../Imges/edit (1).png'
import view from '../../Imges/eye.png'
import deleteimage from '../../Imges/delete.png'
import block from '../../Imges/prohibition.png'
import unblock from '../../Imges/unlocked.png'
import styles from './Dashboard.module.css';
import CircularLoader from '../CircularLoader/CircularLoader'
import Popup from '../Popups/Popup'
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastMessage/ToastMessage';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const popupRef = useRef(null);
    const modalUserRef = useRef(null);
    const modalRef = useRef(null);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBatchTerm, setSearchBatchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
    const [withoutPaginaitonalluser, setwithoutPaginaitonalluser] = useState([]);
    const [isCircularloader, setIsCircularLoader] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupAction, setPopupAction] = useState('');
    const [pendingFunction, setPendingFunction] = useState(null);
    const [pendingArgs, setPendingArgs] = useState([]);

    useEffect(() => {
        if (showBatchModal || showUserModal || isEditing)

            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [showBatchModal, showUserModal, isEditing]);

    const showPopup = (actionText, callbackFn, args = []) => {
        setPopupAction(actionText);
        setPendingFunction(() => callbackFn);
        setPendingArgs(args);
        setPopupOpen(true);
    };

    const handleConfirm = () => {
        if (typeof pendingFunction === 'function') {
            pendingFunction(...pendingArgs);
        }
        setPopupOpen(false);
    };

    const [allUser, setAllUser] = useState([]);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        contact: '',
        role: '',
    });


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleEditToggle();
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            if (modalUserRef.current && !modalUserRef.current.contains(event.target)) {
                setIsCircularLoader(false);
            }
        };

        if (showUserModal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [showUserModal]);


    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowBatchModal(false);
            }
        };

        if (showBatchModal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [showBatchModal]);



    const handleSave = async () => {
        // e.preventDefault();
        setIsCircularLoader(true);
        const allTouched = {};
        Object.keys(edituserdata).forEach(key => {
            if (key !== 'email') {
                allTouched[key] = true;
            }
        });
        setEditTouched(allTouched);


        if (!validateEditForm()) {
            setIsCircularLoader(false);
            return;
        }
        try {

            const response = await api.post(`/users/updateprofile`, edituserdata)
            if (response?.data) {
                setIsEditing(false);
                setIsCircularLoader(false);
                setToggle(!toggle);
                showSuccess('Profile updated succefully');
            }
        } catch (error) {
            setIsEditing(true);
            setIsCircularLoader(false);
            showError('Failed to update profile')
        }

    };
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const HandleBatchviewPage = (batch) => {
        navigate('/batchprogress', { state: { batch } });
    }


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

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        let error = '';


        if (!value) {
            error = 'This field is required';
            return error;
        }


        switch (name) {
            case 'farmerRegNo':
                if (value.length < 3) error = 'Registration number must be at least 3 characters';
                break;
            case 'farmerName':
                if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Name should contain only letters';
                break;
            case 'coffeeType':
                if (value.length < 2) error = 'Please enter a valid food type';
                break;
            case 'farmerAddress':
                if (value.length < 10) error = 'Address should be more detailed';
                break;
            case 'farmInspectionName':
            case 'harvesterName':
            case 'processorName':
            case 'exporterName':
            case 'importerName':
                if (value === "") error = 'Please select an option';
                break;
            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));


        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;


        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };
    const handlepopupSubmit = async (e) => {

        e.preventDefault();
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);


        if (!validateForm()) {
            setIsCircularLoader(false);
            return;
        }

        showPopup('create batch', handleSubmit, [e]);

    };

    const handleSubmit = async () => {

        setIsCircularLoader(true);

        try {
            const res = await api.post(`/batch/createBatch`, formData);
            if (res.data) {

                const couchdb = await axios.post('https://1fvzwv7q-3000.inc1.devtunnels.ms/api/addbatch', {
                    batchId:( res.data?.batch?.batchId).toString(),
                    farmerRegNo: res.data?.batch?.farmerRegNo,
                    farmerName: res.data?.batch?.farmerName,
                    farmerAddress: res.data?.batch?.farmerAddress,
                    farmInspectionName: res.data?.batch?.farmInspectionName,
                    harvesterName: res.data?.batch?.harvesterName,
                    processorName: res.data?.batch?.processorName,
                    exporterName: res.data?.batch?.exporterName,
                    importerName: res.data?.batch?.importerName,
                    coffeeType: res.data?.batch?.coffeeType,
                    qrCode: res.data?.batch?.qrCode,
                    farmInspectionId: res.data?.batch?.farmInspectionId,
                    harvesterId: res.data?.batch?.harvesterId,
                    processorId: res.data?.batch?.processorId,
                    exporterId: res.data?.batch?.exporterId,
                    importerId: res.data?.batch?.importerId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (couchdb) {
                    console.log(couchdb)
                }
                setIsCircularLoader(false);
                showSuccess("Batch Created")
                setToggle(!toggle);
                setShowBatchModal(false);
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
            }
        } catch (error) {
            console.log(error);
            setIsCircularLoader(false);
            showError("Failed to create Batch")
        }
    }

    const handleUserPopupSubmit = async (e) => {
        e.preventDefault();
        showPopup('create user', handleUserSubmit, [e]);
    };

    const handleUserSubmit = async () => {

        setIsCircularLoader(true);
        const allTouched = {};
        Object.keys(userForm).forEach(key => {
            allTouched[key] = true;
        });
        setUserTouched(allTouched);


        if (!validateUserForm()) {
            setIsCircularLoader(false);
            return;
        }


        try {
            const response = await api.post(`/users/createuser`, userForm);
            if (response.data) {
                showSuccess("User Created succefully")
                setIsCircularLoader(false);
                setToggle(!toggle);
                setShowUserModal(false);
                setUserForm({
                    name: '',
                    email: '',
                    contact: '',
                    role: ''
                });
            } else {
                console.error('Failed to create user');
                setIsCircularLoader(false);
                showError("Failed to create user")
            }
        } catch (err) {
            setIsCircularLoader(false);
            console.error('Error:', err);
            showError("Failed to create user")
        }
    }


    const [userErrors, setUserErrors] = useState({});
    const [userTouched, setUserTouched] = useState({});

    const validateUserField = (name, value) => {
        let error = '';

        if (!value) {
            error = 'This field is required';
            return error;
        }


        switch (name) {
            case 'name':
                if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Name should contain only letters';
                else if (value.length < 2) error = 'Name is too short';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            case 'contact':
                if (!/^[0-9]{10,15}$/.test(value)) error = 'Invalid phone number (10-15 digits)';
                break;
            case 'role':
                if (!value) error = 'Please select a role';
                break;
            default:
                break;
        }

        return error;
    };


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


                if (userTouched.role) {
                    const error = validateUserField(name, value);
                    setUserErrors(prev => ({ ...prev, [name]: error }));
                }
            }
        } else {
            setUserForm((prev) => ({
                ...prev,
                [name]: value,
            }));


            if (userTouched[name]) {
                const error = validateUserField(name, value);
                setUserErrors(prev => ({ ...prev, [name]: error }));
            }
        }
    };

    const handleUserBlur = (e) => {
        const { name, value } = e.target;


        setUserTouched(prev => ({ ...prev, [name]: true }));

        const error = validateUserField(name, value);
        setUserErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateUserForm = () => {
        const newErrors = {};
        let isValid = true;


        Object.keys(userForm).forEach(key => {
            const value = key === 'role' ? userForm.role?.slug : userForm[key];
            const error = validateUserField(key, value);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setUserErrors(newErrors);
        return isValid;
    };

    const [edituserdata, setedituserdata] = useState({ name: '', email: '', userType: '', address: '', contact: '' })

    const edithandler = (edituser) => {
        setedituserdata({
            name: edituser?.name,
            email: edituser?.email,
            userType: edituser?.userType,
            address: edituser?.address,
            contact: edituser?.contact
        })
        setIsEditing(!isEditing);
    }
    const userview = (userdata) => {
        navigate('/userdashboard', { state: { userdata } });
    }

    const blockhandler = async (user) => {
        try {
            const response = await api.post(`/users/blockUser?id=${user._id}`);
            if (response.data) {
                // console.log('User blocked successfully!',response?.data?.user?.isBlocked);
                showSuccess('User Blocked Succefully')
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
            const response = await api.post(`/users/unblockUser?id=${user?._id}`,);
            if (response.data) {
                // console.log('User unblocked successfully!',response?.data?.user?.isBlocked);
                showSuccess('User unblocked successfully!');
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
            const response = await api.get(`/users/fetchalluser`, {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm,
                },
            });
            // const resp = await axios.get(`https://1fvzwv7q-3000.inc1.devtunnels.ms/api/batchs`,{
            //     headers:{
            //         contentType:'application/json'
            //     }
            // });
            // console.log(resp)
            setAllUser(response.data.allUsers);
            setwithoutPaginaitonalluser(response?.data?.allUserwihtoutPagination)
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
            const response = await api.get("/batch/getBatch", {
                params: {
                    page: currnetBatchPage,
                    limit: usersPerPage,
                    search: searchBatchTerm,
                }
            });


            setAllBatch(response.data.batches);
            setTotalBatch(response.data.totalBatches);
            setTotalBatchPage(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching batches:', error);

        }

    }

    const [editErrors, setEditErrors] = useState({});
    const [editTouched, setEditTouched] = useState({});

    const validateEditField = (name, value) => {
        let error = '';


        if (name === 'email') return error;


        if (!value && name !== 'userType') {
            error = 'This field is required';
            return error;
        }

        switch (name) {
            case 'name':
                if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Name should contain only letters';
                else if (value.length < 2) error = 'Name is too short';
                break;
            case 'contact':
                if (!/^[0-9]{10,15}$/.test(value)) error = 'Invalid phone number (10-15 digits)';
                break;
            case 'address':
                if (value.length < 10) error = 'Address should be more detailed';
                break;
            case 'userType':
                if (!value && (edituserdata?.userType !== 'user' && edituserdata?.userType !== 'admin')) {
                    error = 'Please select a user type';
                }
                break;
            default:
                break;
        }

        return error;
    };


    const handleeditChange = (e) => {
        const { name, value } = e.target;

        setedituserdata((prev) => ({ ...prev, [name]: value }));


        if (editTouched[name]) {
            const error = validateEditField(name, value);
            setEditErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleEditBlur = (e) => {
        const { name, value } = e.target;


        setEditTouched(prev => ({ ...prev, [name]: true }));


        const error = validateEditField(name, value);
        setEditErrors(prev => ({ ...prev, [name]: error }));
    };


    const validateEditForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(edituserdata).forEach(key => {
            if (key !== 'email') {
                const error = validateEditField(key, edituserdata[key]);
                if (error) {
                    newErrors[key] = error;
                    isValid = false;
                }
            }
        });

        setEditErrors(newErrors);
        return isValid;
    };
    const deleteBatch = async (id) => {
        try {
            const response = await api.delete(`/batch/deletebatch?batchId=${id}`)
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
    }, [currnetBatchPage, searchBatchTerm, toggle]);


    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, toggle]);

    const fetchRoles = async () => {
        try {
            const res = await api.get(`/batch/getRoles`);
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


                                        </td>
                                        <td>

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
                                                <img src={view} alt='images' />
                                            </button>
                                            {
                                                batch?.tracking?.isInspexted ? '' : <button onClick={() => showPopup("delete this batch", deleteBatch, [batch?.batchId])} className={styles.deleteButton}>
                                                    <img src={deleteimage} alt='images' />
                                                </button>
                                            }

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
                                                    ) : ' -----'}
                                                </td>
                                                <td>
                                                    <button onClick={() => edithandler(user)} className={styles.editButton}><img src={edit} alt='images' /></button>
                                                    {
                                                        !user?.isBlocked ? (
                                                            <button onClick={() => showPopup("block this user", blockhandler, [user])} className={styles.editButton}><img src={unblock} alt='images' /></button>
                                                        ) : (
                                                            <button onClick={() => showPopup("unblock this user", unblockhandler, [user])} className={styles.editButton}><img src={block} alt='images' /></button>
                                                        )}

                                                    <button onClick={() => userview(user)} className={styles.editButton}><img src={view} alt='images' /></button>
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
                    <div className={styles.modal} ref={modalRef}>
                        <h2>Add Batch</h2>
                        <form onSubmit={handlepopupSubmit}>
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="farmerRegNo"
                                    placeholder="Farmer Reg No"
                                    value={formData.farmerRegNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={styles.inputtextclasses}
                                />
                                {errors.farmerRegNo && <span className={styles.errorText}>{errors.farmerRegNo}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="farmerName"
                                    placeholder="Farmer Name"
                                    value={formData.farmerName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={styles.inputtextclasses}
                                />
                                {errors.farmerName && <span className={styles.errorText}>{errors.farmerName}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="coffeeType"
                                    placeholder="Food Type"
                                    value={formData.coffeeType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={styles.inputtextclasses}
                                />
                                {errors.coffeeType && <span className={styles.errorText}>{errors.coffeeType}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <textarea
                                    name="farmerAddress"
                                    placeholder="Farmer Address"
                                    value={formData.farmerAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={styles.inputtextclasses}
                                />
                                {errors.farmerAddress && <span className={styles.errorText}>{errors.farmerAddress}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <select
                                    value={formData.farmInspectionName}
                                    name="farmInspectionName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.farmInspectionName ? styles.errorInput : ''}
                                    style={{ color: formData.farmInspectionName ? "black" : "#757587" }}
                                >
                                    <option value="" disabled>Select a farmInspection Name</option>
                                    {withoutPaginaitonalluser.map((user) => (
                                        user?.role?.label === 'Farm Inspection' && (
                                            <option key={user._id} value={user.name} style={{ color: "black" }}>
                                                {user?.name}
                                            </option>
                                        )
                                    ))}
                                </select>
                                {errors.farmInspectionName && <span className={styles.errorText}>{errors.farmInspectionName}</span>}
                            </div>


                            <div className={styles.formGroup}>
                                <select
                                    value={formData.harvesterName}
                                    name="harvesterName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.harvesterName ? styles.errorInput : ''}
                                    style={{ color: formData.harvesterName ? "black" : "#757587" }}
                                >
                                    <option value="" disabled>Select a harvesterName Name</option>
                                    {withoutPaginaitonalluser.map((user) => (
                                        user?.role?.label === 'Harvester' && (
                                            <option key={user._id} value={user.name} style={{ color: "black" }}>
                                                {user?.name}
                                            </option>
                                        )
                                    ))}
                                </select>
                                {errors.harvesterName && <span className={styles.errorText}>{errors.harvesterName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <select
                                    value={formData.processorName}
                                    name="processorName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.processorName ? styles.errorInput : ''}
                                    style={{ color: formData.processorName ? "black" : "#757587" }}
                                >
                                    <option value="" disabled>Select a processorName Name</option>
                                    {withoutPaginaitonalluser.map((user) => (
                                        (user?.role?.label === 'Processor' && <option key={user._id} style={{ color: "black" }}>
                                            {user?.role?.label === 'Processor' && user?.name}
                                        </option>)
                                    ))}
                                </select>
                                {errors.processorName && <span className={styles.errorText}>{errors.processorName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <select
                                    value={formData.exporterName}
                                    name="exporterName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.exporterName ? styles.errorInput : ''}
                                    style={{ color: formData.exporterName ? "black" : "#757587" }}
                                >
                                    <option value="" disabled>Select a exporterName Name</option>
                                    {withoutPaginaitonalluser.map((user) => (
                                        (user?.role?.label === 'Exporter' && <option key={user._id} style={{ color: "black" }}>
                                            {user?.role?.label === 'Exporter' && user?.name}
                                        </option>)
                                    ))}
                                </select>
                                {errors.exporterName && <span className={styles.errorText}>{errors.exporterName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <select
                                    value={formData.importerName}
                                    name="importerName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.importerName ? styles.errorInput : ''}
                                    style={{ color: formData.importerName ? "black" : "#757587" }}
                                >
                                    <option value="" disabled>Select a importerName Name</option>
                                    {withoutPaginaitonalluser.map((user) => (
                                        (user?.role?.label === 'Importer' && <option key={user._id} style={{ color: "black" }}>
                                            {user?.role?.label === 'Importer' && user?.name}
                                        </option>)
                                    ))}
                                </select>
                                {errors.importerName && <span className={styles.errorText}>{errors.importerName}</span>}
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowBatchModal(false)}>Cancel</button>
                                <button type="submit">{isCircularloader ? <CircularLoader size={15} /> : 'Submit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="profile-edit-form">
                    <div className="editformcontianer" ref={popupRef}>
                        <div className={styles.formGroup}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={edituserdata.name}
                                    onChange={handleeditChange}
                                    onBlur={handleEditBlur}
                                    className={editErrors.name ? styles.errorInput : ''}
                                />
                            </label>
                            {editErrors.name && <span className={styles.errorText}>{editErrors.name}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={edituserdata.email}
                                    onChange={handleeditChange}
                                    disabled
                                />
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Contact:
                                <input
                                    type="number"
                                    className={`${styles.contactnumber} ${editErrors.contact ? styles.errorInput : ''}`}
                                    name="contact"
                                    value={edituserdata.contact}
                                    onChange={handleeditChange}
                                    onBlur={handleEditBlur}
                                />
                            </label>
                            {editErrors.contact && <span className={styles.errorText}>{editErrors.contact}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Address:
                                <input
                                    type="text"
                                    name="address"
                                    value={edituserdata.address}
                                    onChange={handleeditChange}
                                    onBlur={handleEditBlur}
                                    className={editErrors.address ? styles.errorInput : ''}
                                />
                            </label>
                            {editErrors.address && <span className={styles.errorText}>{editErrors.address}</span>}
                        </div>

                        {(edituserdata?.userType !== 'user' && edituserdata?.userType !== 'admin') ? (
                            <div className={styles.formGroup}>
                                <label>
                                    User Type:
                                    <select
                                        name="userType"
                                        className={`authtext ${editErrors.userType ? styles.errorInput : ''}`}
                                        value={edituserdata.userType}
                                        onChange={handleeditChange}
                                        onBlur={handleEditBlur}
                                        required
                                    >
                                        <option value="">Select user type</option>
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="retailer">Retailer</option>
                                    </select>
                                </label>
                                {editErrors.userType && <span className={styles.errorText}>{editErrors.userType}</span>}
                            </div>
                        ) : null}

                        <div className={styles.formActions}>
                            <button onClick={handleEditToggle} className="profile-cancel-btn">Cancel</button>
                            <button onClick={() => showPopup("edit this user", handleSave)} className="profile-save-btn">{isCircularloader ? <CircularLoader size={15} /> : 'Submit'}</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {showUserModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} ref={modalUserRef}>
                        <h2>Add User</h2>
                        <form onSubmit={handleUserPopupSubmit}>
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={userForm.name}
                                    onChange={handleUserChange}
                                    onBlur={handleUserBlur}
                                    className={styles.inputtextclasses}
                                />
                                {userErrors.name && <span className={styles.errorText}>{userErrors.name}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={userForm.email}
                                    onChange={handleUserChange}
                                    onBlur={handleUserBlur}
                                    className={styles.inputtextclasses}
                                />
                                {userErrors.email && <span className={styles.errorText}>{userErrors.email}</span>}
                            </div>

                            {/* <div className={styles.formGroup}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={userForm.password}
                                    onChange={handleUserChange}
                                    onBlur={handleUserBlur}
                                    className={styles.inputtextclasses}
                                />
                                {userErrors.password && <span className={styles.errorText}>{userErrors.password}</span>}
                            </div> */}

                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="Contact No."
                                    value={userForm.contact}
                                    onChange={handleUserChange}
                                    onBlur={handleUserBlur}
                                    className={styles.inputtextclasses}
                                />
                                {userErrors.contact && <span className={styles.errorText}>{userErrors.contact}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <select
                                    value={userForm.role?.slug || ''}
                                    name="role"
                                    onChange={handleUserChange}
                                    onBlur={handleUserBlur}
                                    className={userErrors.role ? styles.errorInput : ''}
                                >
                                    <option value="" disabled>Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role.key}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {userErrors.role && <span className={styles.errorText}>{userErrors.role}</span>}
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowUserModal(false)}>Cancel</button>
                                <button type="submit">{isCircularloader ? <CircularLoader size={15} /> : 'Submit'}</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}


            <Popup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onConfirm={handleConfirm}
                action={popupAction}
            />
        </div>
    );
};

export default Dashboard;
