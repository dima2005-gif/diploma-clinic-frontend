import React from "react";
import api from "../../api/axios";

const PatientDashboard = () => {
    const [patientData, setPatientData] = React.useState(null);

    React.useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await api.get('/patient/');
                setPatientData(response.data);
            } catch (error) {
                console.error("Помилка при завантаженні даних пацієнта", error.response?.data);
            }
        };
        fetchPatientData();
    }, []);

    if (!patientData) {
        return <div>Завантаження даних пацієнта...</div>;
    }
    return (
        <div className="patient-dashboard">
            <h1>Вітаємо {patientData.first_name}</h1>
            <p>Ваші дані:</p>
            <ul>
                <li>Ім'я: {patientData.first_name}</li>
                <li>Прізвище: {patientData.last_name}</li>
                <li>По батькові: {patientData.middle_name}</li>
                <li>Вік: {patientData.age}</li>
                <li>Номер телефону: {patientData.phone_number}</li>
                <li>Email: {patientData.email}</li>
                <li>Адреса проживання: {patientData.address}</li>
                <li>Стать: {patientData.sex}</li>
                <li>Вага: {patientData.weight}</li>
                <li>Зріст: {patientData.height}</li>
            </ul>
        </div>
    );
};

export default PatientDashboard;