# 🚗 Cloud-Based QR Code Smart Vehicle Parking Management System

This project is a smart parking solution designed to make urban vehicle parking more efficient, secure, and user-friendly. It uses a **cloud-based web application** integrated with **QR code technology** to allow users to reserve parking slots and enhance vehicle security.

---

## 📌 Project Overview

The **Cloud-Based QR Code Security Smart Vehicle Parking Management System** integrates both hardware and software components to:

- Detect real-time parking slot availability
- Manage online reservations
- Generate unique QR codes for secure entry and exit

Hardware includes **IR sensors** and an **ESP32 microcontroller** that continuously update the slot status to a cloud-connected frontend. Users can reserve slots via the web interface and use generated QR codes for verification at entry points.

---

## 👥 Users & Roles

- **Client:**
  - View available parking slots
  - Make reservations
  - Receive QR code for entry/exit

- **Admin:**
  - Manage real-time slot availability
  - Verify QR codes
  - Monitor system activity via admin panel

---

## 👨‍💻 My Role & Contributions

As the **Frontend Developer**, I was responsible for building the cloud-based user interface using **ReactJS** in **Visual Studio Code**. Key contributions include:

### 🔑 Key Features Developed

- **🔐 Login & Registration Pages**
  - Secure, role-based authentication for admins and clients

- **📷 QR Code Integration**
  - QR code generation after reservation, used for entry/exit verification

- **📍 Parking Slot Display**
  - Real-time slot availability visualization using data from IR sensors and ESP32

- **🛠️ Admin Panel**
  - Admin can verify client QR codes and manage slot statuses

- **🎨 UI/UX Design**
  - Clean, responsive design using modular components and **React Router** for navigation

- **☁️ Cloud Integration**
  - Firebase for real-time data updates
  - AWS Amplify used for hosting and deployment

---

## 🧰 Tech Stack

- **Frontend:** ReactJS, Axios, React Router, Tailwind CSS
- **Cloud Services:** Firebase, AWS Amplify
- **Hardware:** IR Sensors, ESP32 Microcontroller
- **Others:** QR Code Library, VS Code

---

## 🚀 Conclusion

This smart vehicle parking system is a **cost-effective, scalable**, and **secure** solution to modern parking issues. It significantly reduces manual errors, optimizes slot usage, and enhances user experience by blending **IoT**, **cloud computing**, and **web development**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

