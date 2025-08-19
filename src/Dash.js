import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
  TextField,
  Paper,
  Fab,
  InputAdornment,
  Slide,
  Chip,
} from "@mui/material";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LeaveManagement from "./LeaveManagement";
import Tasks from "./Tasks";
import Create from "./Create";
import vdart from "./vdart.webp";
import InternHoursCalculator from "./InternHoursCalculator";
import AssetReport from "./AssetReport";
import PerformancePage from "./PerformancePage";
import InternProfile from "./InternProfile";
import AttendanceManagement from "./AttendanceManagement";
import axios from "axios";
import PaymentStatusPage from "./PaymentStatusPage";
import DocumentView from "./DocumentView";
import DescriptionIcon from "@mui/icons-material/Description";
import PerformanceFeedback from "./PerformanceFeedbackList";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import MicIcon from "@mui/icons-material/Mic";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";

// Speech recognition setup
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

// Speech synthesis setup
const synth = window.speechSynthesis;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(90);
  const [leaveBalance, setLeaveBalance] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  const [presentDays, setPresentDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [activeTimers, setActiveTimers] = useState({
    break: false,
    lunch: false,
    shiftout: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTasks, setCurrentTasks] = useState([
    { id: 0, name: "N/A", progress: 0 },
    { id: 0, name: "N/A", progress: 0 },
    { id: 0, name: "N/A", progress: 0 },
  ]);
  const [darkMode, setDarkMode] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 0, message: "N/A" },
    { id: 0, message: "N/A" },
    { id: 0, message: "N/A." },
    { id: 0, message: "N/A" },
  ]);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [showPerformanceOverview, setShowPerformanceOverview] = useState(false);
  const [showHoursCalculator, setShowHoursCalculator] = useState(false);
  const [showStatusBarDetails, setShowStatusBarDetails] = useState(true);
  const [taskStatusCounts, setTaskStatusCounts] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [internHoursData, setInternHoursData] = useState([]);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your Tracktern assistant. How can I help you today?",
      options: [
        "Go to Dashboard",
        "Check my attendance",
        "View my tasks",
        "Apply for leave",
        "Check payment status",
        "logout the page",
      ],
      icon: <SmartToyIcon />,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    department: "",
    position: "",
    contact: "",
    photo: "",
    emp_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceId, setAttendanceId] = useState(null);
  const [breakTime, setBreakTime] = useState(0);
  const [lunchTime, setLunchTime] = useState(0);
  const [shiftOutTime, setShiftOutTime] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const breakTimerRef = useRef(null);
  const lunchTimerRef = useRef(null);
  const shiftOutTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);

  // Weekly performance data
  const [weeklyPerformance, setWeeklyPerformance] = useState([
    {
      week: "Week 1",
      attendance: 0,
      tasks: 0,
      productivity: 0,
      average: 0,
    },
    {
      week: "Week 2",
      attendance: 0,
      tasks: 0,
      productivity: 0,
      average: 0,
    },
  ]);

  useEffect(() => {
    const updateWeeklyPerformance = async () => {
      try {
        const totalTasks = Object.values(taskStatusCounts).reduce(
          (a, b) => a + b,
          0
        );
        const completedTasks = taskStatusCounts["Completed"] || 0;
        const taskCompletionRate =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Fetch Productivity Data (same API as in PerformancePage.js)
        const response = await axios.get("http://localhost:8000/Sims/tasks/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });

        const productivityData = response.data.map((task) => {
          const committed = task.hours_committed || 0;
          const actual = task.hours_actual || committed;
          return committed > 0 ? (actual / committed) * 100 : 100;
        });

        const avgProductivity =
          productivityData.length > 0
            ? Math.round(
                productivityData.reduce((a, b) => a + b, 0) /
                  productivityData.length
              )
            : 100;

        setWeeklyPerformance((prev) => [
          {
            week: `This Week`,
            attendance: attendancePercentage,
            tasks: taskCompletionRate,
            productivity: avgProductivity,
            average: Math.round(
              (attendancePercentage + taskCompletionRate + avgProductivity) / 3
            ),
          },
        ]);
      } catch (error) {
        console.error("Error updating Weekly Performance", error);
      }
    };

    updateWeeklyPerformance();
  }, [attendancePercentage, taskStatusCounts]);

  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      if (hour >= 18 && minute >= 0) {
        // 6 PM
        confirmToggleTimerOff();
        clearInterval(timer);
      }
    }, 60000); // check every 1 minute

    return () => clearInterval(timer);
  }, [timerActive]);

  // VDart company information
  const vdartInfo = {
    about:
      "VDart is a global IT staffing and solutions provider specializing in niche skills. Founded in 2007, we have grown to become one of the fastest growing staffing firms in North America.",
    services: [
      "IT Staffing & Recruitment",
      "Managed Services",
      "RPO (Recruitment Process Outsourcing)",
      "Project Solutions",
      "Training & Development",
    ],
    locations: [
      "Headquarters: Atlanta, GA, USA",
      "India Offices: Bangalore, Chennai, Hyderabad, Pune",
      "Other Locations: Canada, Mexico, UK",
    ],
    values: [
      "Customer Focus",
      "Integrity",
      "Excellence",
      "Innovation",
      "Teamwork",
    ],
  };

  // Speak text using speech synthesis
  const speak = (text) => {
    if (synth && text) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle speech recognition
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputMessage(speechResult);
      setIsListening(false);
      // Auto-send the message after voice input
      setTimeout(handleSendMessage, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setSnackbarMessage("Error occurred in speech recognition");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "Listening... Speak now",
          icon: <MicIcon color="primary" />,
        },
      ]);
    } else {
      setSnackbarMessage("Speech recognition not supported in your browser");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Toggle chatbot
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen && messages.length === 1) {
      // Speak the initial greeting when opening chat
      speak("Hello! I'm your Tracktern assistant. How can I help you today?");
    }
  };

  // Simulate bot typing
  const simulateTyping = (callback) => {
    setBotTyping(true);
    setTimeout(() => {
      callback();
      setBotTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      sender: "user",
      text: inputMessage,
      icon: <PersonIcon />,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Process the message and generate bot response
    simulateTyping(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages((prev) => [...prev, botResponse]);
      // Speak the bot's response
      speak(botResponse.text);

      // Add to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          question: inputMessage,
          answer: botResponse.text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });
  };

  // Format response with icons and structured data
  const formatResponse = (text, data = null) => {
    if (!data) return text;

    if (Array.isArray(data)) {
      return `${text}\n\n${data.map((item) => `• ${item}`).join("\n")}`;
    }

    if (typeof data === "object") {
      return `${text}\n\n${Object.entries(data)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join("\n")}`;
    }

    return text;
  };

  // Generate detailed bot response based on user input
  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const latestPerformance = weeklyPerformance[weeklyPerformance.length - 1];
    const totalTasks = Object.values(taskStatusCounts).reduce(
      (a, b) => a + b,
      0
    );
    const completedTasks = taskStatusCounts["Completed"] || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const productiveHours = formatTime(
      elapsedTime - breakTime - lunchTime - shiftOutTime
    );

    // Greetings
    if (
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hey")
    ) {
      const greetings = [
        `Hello ${
          personalInfo.name || "there"
        }! I'm your Tracktern assistant. What can I do for you today?`,
        `Hi ${
          personalInfo.name || "there"
        }! Ready to make your day more productive?`,
        `Hey ${
          personalInfo.name || "there"
        }! How can I assist you with your work today?`,
      ];
      return {
        sender: "bot",
        text: greetings[Math.floor(Math.random() * greetings.length)],
        options: [
          "Go to Dashboard",
          "Check my attendance",
          "View my tasks",
          "What can you do?",
        ],
        icon: <SmartToyIcon />,
      };
    }

    // Thanks
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return {
        sender: "bot",
        text: "You're welcome! 😊 Is there anything else I can help with?",
        options: ["No, that's all", "Yes, I need more help", "Go to Dashboard"],
        icon: <SmartToyIcon />,
      };
    }

    // Date and Time
    if (
      lowerMessage.includes("time") ||
      lowerMessage.includes("date") ||
      lowerMessage.includes("today")
    ) {
      return {
        sender: "bot",
        text: `Today is ${currentDate} and the current time is ${currentTime}.`,
        options: ["Check my shift time", "View attendance", "Go to Dashboard"],
        icon: <AccessTimeIcon />,
      };
    }

    // Logout command
    if (
      lowerMessage.includes("logout") ||
      lowerMessage.includes("sign out") ||
      lowerMessage.includes("log out")
    ) {
      const confirmationMessage = {
        sender: "bot",
        text: "Are you sure you want to logout?",
        options: ["Yes, logout", "No, stay logged in"],
        icon: <LogoutIcon />,
      };
      // Add handler for the "Yes, logout" option
      if (lowerMessage.includes("yes, logout")) {
        handleLogout();
        return {
          sender: "bot",
          text: "Logging you out... Goodbye!",
          options: [],
        };
      }

      return confirmationMessage;
    }
    // Navigation commands
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("home")) {
      setCurrentPage("Dashboard");
      return {
        sender: "bot",
        text: "I've taken you to the Dashboard. Here you can see:\n• Your attendance\n• Task progress\n• Performance metrics\n• Quick actions",
        options: ["View my profile", "Check attendance", "See performance"],
        icon: <HomeWorkIcon />,
      };
    }

    if (lowerMessage.includes("profile")) {
      setCurrentPage("Profile");
      return {
        sender: "bot",
        text: "I've opened your Profile page. Here you can:\n• View and update personal information\n• Check your position and department\n• See your contact details",
        options: ["Edit profile", "Go to Dashboard", "View documents"],
        icon: <PersonIcon />,
      };
    }

    if (lowerMessage.includes("payment") || lowerMessage.includes("salary")) {
      setCurrentPage("Payment Status");
      return {
        sender: "bot",
        text: "I've opened the Payment Status page. Here you can:\n• Check payment details\n• View payment history\n• See upcoming payments",
        options: [
          "View payment history",
          "Check next payment",
          "Go to Dashboard",
        ],
        icon: <CurrencyRupeeIcon />,
      };
    }

    if (lowerMessage.includes("asset") || lowerMessage.includes("report")) {
      setCurrentPage("Asset Report Issue");
      return {
        sender: "bot",
        text: "I've opened the Asset Report page. Here you can:\n• Report asset issues\n• Track reported problems\n• Check resolution status",
        options: ["Report new issue", "View my reports", "Go to Dashboard"],
        icon: <ArticleIcon />,
      };
    }

    if (lowerMessage.includes("document") || lowerMessage.includes("files")) {
      setCurrentPage("Document View");
      return {
        sender: "bot",
        text: "I've opened the Document View page. Here you can:\n• Access important documents\n• Download pay slips\n• View certificates",
        options: ["View pay slips", "Download certificates", "Go to Dashboard"],
        icon: <DescriptionIcon />,
      };
    }

    if (
      lowerMessage.includes("performance") ||
      lowerMessage.includes("feedback")
    ) {
      setCurrentPage("Performance Feedback");
      return {
        sender: "bot",
        text: "I've opened the Performance Feedback page. Here you can:\n• View performance reviews\n• Read manager feedback\n• Check your ratings",
        options: ["View latest feedback", "Check ratings", "Go to Dashboard"],
        icon: <AssessmentIcon />,
      };
    }

    if (lowerMessage.includes("attendance") || lowerMessage.includes("time")) {
      setCurrentPage("AttendanceManagement");
      return {
        sender: "bot",
        text: "I've opened the Attendance Management page. Here you can:\n• Check in/out\n• View attendance records\n• Manage your time logs",
        options: ["Check my attendance", "View time logs", "Go to Dashboard"],
        icon: <EventIcon />,
      };
    }

    if (lowerMessage.includes("leave") || lowerMessage.includes("holiday")) {
      setCurrentPage("Leave Management");
      return {
        sender: "bot",
        text: "I've opened the Leave Management page. Here you can:\n• Apply for leave\n• Check leave balance\n• View leave history",
        options: ["Apply for leave", "Check balance", "Go to Dashboard"],
        icon: <EventIcon />,
      };
    }

    if (lowerMessage.includes("task") || lowerMessage.includes("work")) {
      setCurrentPage("Tasks");
      return {
        sender: "bot",
        text: "I've opened the Tasks page. Here you can:\n• View your tasks\n• Track progress\n• Create new tasks",
        options: ["Create new task", "View completed tasks", "Go to Dashboard"],
        icon: <WorkIcon />,
      };
    }

    // Detailed information queries
    if (
      lowerMessage.includes("leave balance") ||
      lowerMessage.includes("leave remaining")
    ) {
      return {
        sender: "bot",
        text: `📅 Leave Balance:\n\n• Total Remaining: ${leaveBalance} days\n• Casual Leave: ${Math.floor(
          leaveBalance * 0.6
        )} days\n• Sick Leave: ${Math.floor(
          leaveBalance * 0.4
        )} days\n\nWould you like to apply for leave?`,
        options: ["Apply for leave", "View leave history", "Go to Dashboard"],
        icon: <EventIcon />,
      };
    }

    if (
      lowerMessage.includes("attendance percentage") ||
      lowerMessage.includes("attendance") ||
      lowerMessage.includes("present days")
    ) {
      const attendanceStatus =
        attendancePercentage >= 90
          ? "excellent"
          : attendancePercentage >= 75
          ? "good"
          : "needs improvement";
      return {
        sender: "bot",
        text: `📊 Attendance Overview:\n\n• Current: ${attendancePercentage}% (${attendanceStatus})\n• Present: ${presentDays} days\n• Absent: ${
          totalDays - presentDays
        } days\n• Total working days: ${totalDays}\n\nTrend: ${
          weeklyPerformance[weeklyPerformance.length - 1].attendance >
          weeklyPerformance[0].attendance
            ? "improving 📈"
            : "consistent ↔️"
        }`,
        options: [
          "View attendance details",
          "Check leave balance",
          "Go to Dashboard",
        ],
        icon: <EventIcon />,
      };
    }

    if (
      lowerMessage.includes("performance") ||
      lowerMessage.includes("rating") ||
      lowerMessage.includes("productivity")
    ) {
      return {
        sender: "bot",
        text: `📈 Performance Metrics:\n\n• Overall Average: ${
          latestPerformance.average
        }%\n• Attendance: ${
          latestPerformance.attendance
        }%\n• Task Completion: ${latestPerformance.tasks}%\n• Productivity: ${
          latestPerformance.productivity
        }%\n\nTrend: ${
          latestPerformance.average > weeklyPerformance[0].average
            ? "improving 📈"
            : "consistent ↔️"
        }\n\nKeep up the good work! 💪`,
        options: [
          "View detailed performance",
          "Check tasks",
          "Go to Dashboard",
        ],
        icon: <AssessmentIcon />,
      };
    }

    if (
      lowerMessage.includes("current time") ||
      lowerMessage.includes("elapsed time") ||
      lowerMessage.includes("shift time")
    ) {
      return {
        sender: "bot",
        text: `⏱️ Time Breakdown:\n\n• Total Shift Time: ${formatTime(
          elapsedTime
        )}\n• Break Time: ${formatTime(breakTime)}\n• Lunch Time: ${formatTime(
          lunchTime
        )}\n• Meeting/Other Time: ${formatTime(
          shiftOutTime
        )}\n• Productive Hours: ${productiveHours}`,
        options: ["Start break", "Start lunch", "Check out"],
        icon: <AccessTimeIcon />,
      };
    }

    if (
      lowerMessage.includes("task status") ||
      lowerMessage.includes("tasks completed")
    ) {
      return {
        sender: "bot",
        text: `📋 Task Status:\n\n• Completed: ${completedTasks} tasks\n• In Progress: ${
          taskStatusCounts["In Progress"] || 0
        } tasks\n• Pending: ${
          taskStatusCounts["Pending"] || 0
        } tasks\n• Overdue: ${
          taskStatusCounts["Overdue"] || 0
        } tasks\n\nOverall completion rate: ${completionRate}%`,
        options: ["View all tasks", "Create new task", "Go to Dashboard"],
        icon: <WorkIcon />,
      };
    }

    // VDart company information
    if (
      lowerMessage.includes("vdart") ||
      lowerMessage.includes("company") ||
      lowerMessage.includes("about")
    ) {
      return {
        sender: "bot",
        text:
          formatResponse(
            `🏢 About VDart:\n\n${vdartInfo.about}\n\nOur Services:`,
            vdartInfo.services
          ) +
          `\n\nLocations:\n${vdartInfo.locations.join(
            "\n"
          )}\n\nCore Values:\n${vdartInfo.values.join("\n")}`,
        options: ["Current projects", "Training programs", "Go to Dashboard"],
        icon: <BusinessIcon />,
      };
    }

    if (
      lowerMessage.includes("project") ||
      lowerMessage.includes("current work")
    ) {
      return {
        sender: "bot",
        text: `🛠️ Current Projects:\n\n• Project Aurora (Web Development)\n• Project Nexus (Mobile App)\n• Project Quantum (AI Implementation)\n\nYour current assignment: ${
          personalInfo.department || "N/A"
        } team`,
        options: ["View my tasks", "Check performance", "Go to Dashboard"],
        icon: <WorkIcon />,
      };
    }

    if (
      lowerMessage.includes("training") ||
      lowerMessage.includes("learning")
    ) {
      return {
        sender: "bot",
        text: `🎓 Training Programs:\n\n1. React Advanced (Ongoing)\n2. Node.js Certification\n3. Cloud Computing Basics\n4. Agile Methodology\n\nYour progress: 2/4 programs completed`,
        options: ["View certificates", "Check schedule", "Go to Dashboard"],
        icon: <SchoolIcon />,
      };
    }

    // Functional commands
    if (
      lowerMessage.includes("live feed") ||
      lowerMessage.includes("start shift") ||
      lowerMessage.includes("check in")
    ) {
      if (!timerActive) {
        toggleTimer();
        return {
          sender: "bot",
          text: "✅ You've been checked in successfully! Your shift timer has started.",
          options: ["Start break", "Check current time", "View attendance"],
          icon: <AccessTimeIcon />,
        };
      } else {
        return {
          sender: "bot",
          text: "ℹ️ You're already checked in. Would you like to check out instead?",
          options: [
            "Yes, check out",
            "No, stay checked in",
            "View time details",
          ],
          icon: <AccessTimeIcon />,
        };
      }
    }

    if (
      lowerMessage.includes("check out") ||
      lowerMessage.includes("end shift")
    ) {
      if (timerActive) {
        setConfirmDialogOpen(true);
        return {
          sender: "bot",
          text: "⚠️ Please confirm you want to check out and end your shift.",
          options: ["Confirm checkout", "Cancel", "View time summary"],
          icon: <AccessTimeIcon />,
        };
      } else {
        return {
          sender: "bot",
          text: "ℹ️ You're not currently checked in. Would you like to check in?",
          options: ["Yes, check in", "No, stay checked out", "View attendance"],
          icon: <AccessTimeIcon />,
        };
      }
    }

    if (lowerMessage.includes("start break")) {
      toggleBreak();
      return {
        sender: "bot",
        text: "⏳ Your break timer has started. Enjoy your break! ☕",
        options: ["End break", "Check break time", "View time summary"],
        icon: <AccessTimeIcon />,
      };
    }

    if (lowerMessage.includes("end break")) {
      toggleBreak();
      return {
        sender: "bot",
        text: "✅ Your break has ended. Welcome back! 💪",
        options: ["Start lunch", "Check current time", "View attendance"],
        icon: <AccessTimeIcon />,
      };
    }

    if (lowerMessage.includes("start lunch")) {
      toggleLunch();
      return {
        sender: "bot",
        text: "⏳ Your lunch timer has started. Enjoy your meal! 🍽️",
        options: ["End lunch", "Check lunch time", "View time summary"],
        icon: <AccessTimeIcon />,
      };
    }

    if (lowerMessage.includes("end lunch")) {
      toggleLunch();
      return {
        sender: "bot",
        text: "✅ Your lunch break has ended. Welcome back! 💪",
        options: ["Start break", "Check current time", "View attendance"],
        icon: <AccessTimeIcon />,
      };
    }

    if (
      lowerMessage.includes("dark mode") ||
      lowerMessage.includes("light mode")
    ) {
      toggleDarkMode();
      return {
        sender: "bot",
        text: `🌓 I've switched to ${darkMode ? "light ☀️" : "dark 🌙"} mode.`,
        options: ["Go to Dashboard", "View profile", "Check settings"],
        icon: darkMode ? <Brightness7Icon /> : <Brightness4Icon />,
      };
    }

    // Information queries
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("what can you do")
    ) {
      return {
        sender: "bot",
        text: `🛠️ I can help you with:\n\n1. Attendance Tracking:\n• Check in/out\n• Manage breaks\n• View records\n\n2. Leave Management:\n• Check balance (${leaveBalance} days)\n• Apply for leave\n\n3. Task Management:\n• View status (${totalTasks} tasks)\n• Track progress\n\n4. Performance:\n• View ratings (${latestPerformance.average}%)\n• Check feedback\n\n5. General:\n• Navigate dashboard\n• Access documents\n• Report issues\n\nTry saying:\n• "What's my leave balance?"\n• "How's my attendance?"\n• "Start my shift"\n• "Show my tasks"`,
        options: ["Go to Dashboard", "Check attendance", "View leave balance"],
        icon: <HelpIcon />,
      };
    }

    // Default response
    return {
      sender: "bot",
      text: `🤔 I'm not sure I understand. Here are some things I can help with:\n\n• "What's my leave balance?" (You have ${leaveBalance} days)\n• "How's my attendance?" (Currently ${attendancePercentage}%)\n• "Start my shift"\n• "Show my tasks" (${totalTasks} total tasks)\n• "View performance" (Latest average: ${latestPerformance.average}%)`,
      options: ["Go to Dashboard", "Check my profile", "View help options"],
      icon: <HelpIcon />,
    };
  };

  const handleQuickOptionSelect = (option) => {
    setInputMessage(option);
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:8000/Sims/attendance/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      console.log("Attendance data:", response.data);

      if (response.data && response.data.length > 0) {
        const employeeData = response.data[0];
        setLeaveBalance(employeeData.summary?.remaining_leave || 5);

        // Find today's attendance record
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = employeeData.records.find(
          (record) => record.date === today
        );

        if (todayRecord) {
          // Always set attendance ID if record exists
          setAttendanceId(todayRecord.id);

          // Check if shift is active (no check_out time)
          const isShiftActive = !todayRecord.check_out;
          setTimerActive(isShiftActive);

          // Calculate elapsed time (current time - check_in time)
          const checkInTime = new Date(todayRecord.check_in);
          const currentTime = new Date();
          const elapsedSeconds = Math.floor((currentTime - checkInTime) / 1000);
          setElapsedTime(elapsedSeconds);

          // Calculate total times and detect active timer
          let totalBreakTime = 0;
          let totalLunchTime = 0;
          let totalShiftOutTime = 0;
          let activeTimer = null;

          todayRecord.logs.forEach((log) => {
            if (log.check_out) {
              const start = new Date(log.check_in);
              const end = new Date(log.check_out);
              const duration = Math.floor((end - start) / 1000);

              switch (log.reason) {
                case "BREAK":
                  totalBreakTime += duration;
                  break;
                case "LUNCH":
                  totalLunchTime += duration;
                  break;
                case "MEETING":
                case "OTHERS":
                  totalShiftOutTime += duration;
                  break;
                default:
                  break;
              }
            } else {
              // This is an active timer
              activeTimer = {
                type: log.reason,
                startTime: new Date(log.check_in),
              };
            }
          });

          // Set accumulated times
          setBreakTime(totalBreakTime);
          setLunchTime(totalLunchTime);
          setShiftOutTime(totalShiftOutTime);

          // If there's an active timer, calculate its elapsed time
          if (activeTimer && isShiftActive) {
            const activeSeconds = Math.floor(
              (currentTime - activeTimer.startTime) / 1000
            );

            switch (activeTimer.type) {
              case "BREAK":
                setActiveTimers({ break: true, lunch: false, shiftout: false });
                setBreakTime(totalBreakTime + activeSeconds);
                break;
              case "LUNCH":
                setActiveTimers({ break: false, lunch: true, shiftout: false });
                setLunchTime(totalLunchTime + activeSeconds);
                break;
              case "MEETING":
              case "OTHERS":
                setActiveTimers({ break: false, lunch: false, shiftout: true });
                setShiftOutTime(totalShiftOutTime + activeSeconds);
                break;
              default:
                break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Performance chart data
  const performanceChartData = {
    labels: weeklyPerformance.map((item) => item.week),
    datasets: [
      {
        label: "Attendance",
        data: weeklyPerformance.map((item) => item.attendance),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      // {
      //   label: 'Hours Worked',
      //   data: weeklyPerformance.map(item => item.hours),
      //   backgroundColor: 'rgba(54, 162, 235, 0.7)',
      //   borderColor: 'rgba(54, 162, 235, 1)',
      //   borderWidth: 1,
      // },
      {
        label: "Task Completion",
        data: weeklyPerformance.map((item) => item.tasks),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Productivity",
        data: weeklyPerformance.map((item) => item.productivity),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Overall Average",
        data: weeklyPerformance.map((item) => item.average),
        type: "line",
        borderColor: "#4CAF50",
        borderWidth: 3,
        pointBackgroundColor: "#4CAF50",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 100,
        stepSize: 10,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ": " + context.raw + "%";
          },
        },
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
        },
      },
    },
  };

  const postAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const res = await axios.post(
        "http://localhost:8000/Sims/attendance/",
        {
          emp_id: personalInfo.emp_id,
          name: personalInfo.name,
          date: today,
          check_in: new Date().toISOString(),
          status: "Pending",
          present_status: "Present",
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const attId = res.data?.attendance?.id;
      if (attId) {
        setAttendanceId(attId);
        console.log("POST Attendance", res.data);
      } else {
        console.log("POST Attendance (Log only):", res.data);
      }
    } catch (error) {
      console.error("Attendance POST failed", error);
      if (error.response) {
        console.log("Backend error response:", error.response.data);
      }
    }
  };

  const patchAttendance = async (data) => {
    if (!attendanceId) {
      console.warn("No attendance ID to patch.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:8000/Sims/attendance/${attendanceId}/`,
        data,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log("PATCH Attendance", res.data);
    } catch (error) {
      console.error("Attendance PATCH failed", error);
    }
  };

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:8000/Sims/attendances/leave_balance/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.data && typeof response.data.remaining === "number") {
          setLeaveBalance(response.data.remaining);
        } else {
          console.warn("Unexpected leave balance response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchLeaveBalance();
  }, []);
  const timeStringToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const responseUser = await axios.get(
          "http://localhost:8000/Sims/temps/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        console.log("User Data Response:", responseUser.data);
        const emp_id = responseUser.data.emp_id;

        if (!emp_id) {
          setError("Employee ID not found.");
          setLoading(false);
          return;
        }

        const response1 = await axios.get(
          "http://localhost:8000/Sims/personal-data/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Personal Data Response:", response1.data);

        const response2 = await axios.get(
          "http://localhost:8000/Sims/college-details/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("College Data Response:", response2.data);

        const response3 = await axios.get("http://localhost:8000/Sims/temps/", {
          headers: { Authorization: `Token ${token}` },
        });
        const response4 = await axios.get(
          "http://localhost:8000/Sims/user-data/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Temp Data Response:", response3.data);
        console.log("Temp222 Data Response:", response1.data);
        if (response1.data && response2.data && response3.data) {
          setPersonalInfo({
            name: response1.data.username || "N/A",
            department: response4.data.department || "N/A",
            position: response3.data.role || "N/A",
            contact: response1.data.phone_no || "N/A",
            photo: response1.data.photo
              ? `http://localhost:8000${response1.data.photo}`
              : "",
            emp_id: emp_id,
          });
        }

        // Fetch attendance data after personal info is set
        await fetchAttendanceData();
        await fetchAttendancePercentage();
        await liveFeedInitializer();
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response ? err.response.data : err.message
        );
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (timerActive) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    }

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [timerActive]);

  const toggleTimer = async () => {
    if (timerActive) {
      setConfirmDialogOpen(true);
    } else {
      setTimerActive(true);
      setSnackbarMessage("Checked in successfully!");
      setSnackbarOpen(true);

      await postAttendance();

      // Use simpleattendancedata API to initialize timers
      setTimeout(async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            "http://localhost:8000/Sims/simpleattendancedata/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          const data = res.data;
          if (data) {
            setElapsedTime(timeStringToSeconds(data.total_current_time));
            setBreakTime(timeStringToSeconds(data.break_time));
            setLunchTime(timeStringToSeconds(data.lunch_time));
            setShiftOutTime(timeStringToSeconds(data.other_time));
          }
        } catch (err) {
          console.error("Error fetching simple attendance data:", err);
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (!timerActive) return;

    // Prevent multiple intervals
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
    }

    // Start interval
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Cleanup on unmount or timerActive false
    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    };
  }, [timerActive]);

  const stopAllTimers = () => {
    if (breakTimerRef.current) {
      clearInterval(breakTimerRef.current);
      breakTimerRef.current = null;
    }
    if (lunchTimerRef.current) {
      clearInterval(lunchTimerRef.current);
      lunchTimerRef.current = null;
    }
    if (shiftOutTimerRef.current) {
      clearInterval(shiftOutTimerRef.current);
      shiftOutTimerRef.current = null;
    }
    setActiveTimers({
      break: false,
      lunch: false,
      shiftout: false,
    });
  };

  // const fetchAttendanceDateRange = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const response = await axios.get(
  //       "http://localhost:8000/Sims/attendancedaterange/",
  //       {
  //         headers: { Authorization: `Token ${token}` },
  //       }
  //     );

  //     if (response.data && response.data.length > 0) {
  //       const record = response.data[0];
  //       const today = new Date().toDateString();

  //       const todayLogs = record.logs.filter(
  //         (log) => new Date(log.check_in).toDateString() === today
  //       );

  //       let totalBreakSeconds = 0;
  //       let totalLunchSeconds = 0;
  //       let totalShiftOutSeconds = 0;
  //       let totalElapsedSeconds = 0;

  //       if (todayLogs.length > 0) {
  //         const sortedTodayLogs = [...todayLogs].sort(
  //           (a, b) => new Date(a.check_in) - new Date(b.check_in)
  //         );
  //         const firstLogIn = new Date(sortedTodayLogs[0].check_in);

  //         const lastLogWithOut = [...sortedTodayLogs]
  //           .reverse()
  //           .find((log) => log.check_out);
  //         const lastLogOut = lastLogWithOut
  //           ? new Date(lastLogWithOut.check_out)
  //           : new Date();

  //         totalElapsedSeconds = Math.floor((lastLogOut - firstLogIn) / 1000);

  //         // Calculate Break/Lunch/ShiftOut as gaps between logs
  //         for (let i = 0; i < sortedTodayLogs.length - 1; i++) {
  //           const currentLog = sortedTodayLogs[i];
  //           const nextLog = sortedTodayLogs[i + 1];

  //           if (currentLog.check_out && nextLog.check_in && currentLog.reason) {
  //             const currentOut = new Date(currentLog.check_out);
  //             const nextIn = new Date(nextLog.check_in);
  //             const gapSeconds = Math.floor((nextIn - currentOut) / 1000);

  //             const reason = currentLog.reason.toLowerCase();
  //             if (reason === "break") {
  //               totalBreakSeconds += gapSeconds;
  //             } else if (reason === "lunch") {
  //               totalLunchSeconds += gapSeconds;
  //             } else if (reason === "meeting" || reason === "others") {
  //               totalShiftOutSeconds += gapSeconds;
  //             }
  //           }
  //         }
  //       }

  //       setElapsedTime(totalElapsedSeconds);
  //       setBreakTime(totalBreakSeconds);
  //       setLunchTime(totalLunchSeconds);
  //       setShiftOutTime(totalShiftOutSeconds);
  //     } else {
  //       setElapsedTime(0);
  //       setBreakTime(0);
  //       setLunchTime(0);
  //       setShiftOutTime(0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching attendancedaterange:", error);
  //     setElapsedTime(0);
  //     setBreakTime(0);
  //     setLunchTime(0);
  //     setShiftOutTime(0);
  //   }
  // };

  const toggleBreak = () => {
    if (activeTimers.lunch || activeTimers.shiftout) {
      setSnackbarMessage("Please end current activity before starting break!");
      setSnackbarOpen(true);
      return;
    }

    if (!activeTimers.break) {
      // Start break
      stopAllTimers();
      breakTimerRef.current = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
      setActiveTimers({ break: true, lunch: false, shiftout: false });
      patchAttendance({
        status: "start break",
        reason: "Break",
        check_in: new Date().toISOString(),
      });
      setSnackbarMessage("Break started! Timer running...");
    } else {
      // End break
      stopAllTimers();
      postAttendance();
      setSnackbarMessage("Break ended successfully.");
    }
    setSnackbarOpen(true);
  };

  const toggleLunch = () => {
    if (activeTimers.break || activeTimers.shiftout) {
      setSnackbarMessage("Please end current activity before starting lunch!");
      setSnackbarOpen(true);
      return;
    }

    if (!activeTimers.lunch) {
      // Start lunch
      stopAllTimers();
      lunchTimerRef.current = setInterval(() => {
        setLunchTime((prev) => prev + 1);
      }, 1000);
      setActiveTimers({ break: false, lunch: true, shiftout: false });
      patchAttendance({
        status: "start lunch",
        reason: "Lunch",
        check_in: new Date().toISOString(),
      });
      setSnackbarMessage("Lunch started! Timer running...");
    } else {
      // End lunch
      stopAllTimers();
      postAttendance();
      setSnackbarMessage("Lunch ended successfully.");
    }
    setSnackbarOpen(true);
  };

  const fetchAttendancePercentage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/Sims/attendance/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        const employeeData = response.data[0];
        const present = employeeData.summary?.present_days || 0;
        const total = employeeData.summary?.total_days || 1; // Avoid division by zero

        setPresentDays(present);
        setTotalDays(total);
        setAttendancePercentage(Math.round((present / total) * 100));
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const toggleOthers = () => {
    if (activeTimers.break || activeTimers.lunch) {
      setSnackbarMessage("Please end current activity before starting break!");
      setSnackbarOpen(true);
      return;
    }

    if (!activeTimers.shiftout) {
      // Start others
      stopAllTimers();
      shiftOutTimerRef.current = setInterval(() => {
        setShiftOutTime((prev) => prev + 1);
      }, 1000);
      setActiveTimers({ break: false, lunch: false, shiftout: true });
      patchAttendance({
        status: "start out",
        reason: "Meeting",
        check_in: new Date().toISOString(),
      });
      setSnackbarMessage("Meeting or Others started! Timer running...");
    } else {
      // End others
      stopAllTimers();
      postAttendance();
      setSnackbarMessage("Meeting or Others ended successfully.");
    }
    setSnackbarOpen(true);
  };

  const confirmToggleTimerOff = () => {
    stopAllTimers();
    setTimerActive(false);
    setElapsedTime(0);
    setSnackbarMessage("Checked out successfully!");
    setSnackbarOpen(true);
    setConfirmDialogOpen(false);

    patchAttendance({
      check_out: new Date().toISOString(),
      status: "Approved",
      present_status: "Present",
      reason: "End of Shift",
    });
  };

  const cancelToggleTimerOff = () => {
    setConfirmDialogOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowHoursCalculator(false);
    setShowPerformanceOverview(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const liveFeedInitializer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8000/Sims/attendanceanalysis/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const data = res.data;

      // Always restore timer values
      setElapsedTime(timeStringToSeconds(data.total_current_time));
      setBreakTime(timeStringToSeconds(data.break_time));
      setLunchTime(timeStringToSeconds(data.lunch_time));
      setShiftOutTime(timeStringToSeconds(data.other_time));

      // Clear previous intervals if any
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
      if (lunchTimerRef.current) {
        clearInterval(lunchTimerRef.current);
        lunchTimerRef.current = null;
      }
      if (shiftOutTimerRef.current) {
        clearInterval(shiftOutTimerRef.current);
        shiftOutTimerRef.current = null;
      }

      // Show live feed UI if any timer is currently active
      const isAnyTimerActive =
        data.is_currently_in ||
        data.is_break_on ||
        data.is_lunch_on ||
        data.is_others_on;
      setTimerActive(isAnyTimerActive);

      // Start main shift timer if active
      if (data.is_currently_in) {
        elapsedTimerRef.current = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
      }

      // Start break timer if active
      if (data.is_break_on) {
        setActiveTimers({ break: true, lunch: false, shiftout: false });
        breakTimerRef.current = setInterval(() => {
          setBreakTime((prev) => prev + 1);
        }, 1000);
      }

      // Start lunch timer if active
      else if (data.is_lunch_on) {
        setActiveTimers({ break: false, lunch: true, shiftout: false });
        lunchTimerRef.current = setInterval(() => {
          setLunchTime((prev) => prev + 1);
        }, 1000);
      }

      // Start other timer if active
      else if (data.is_others_on) {
        setActiveTimers({ break: false, lunch: false, shiftout: true });
        shiftOutTimerRef.current = setInterval(() => {
          setShiftOutTime((prev) => prev + 1);
        }, 1000);
      }

      // No auxiliary timers are active
      else {
        setActiveTimers({ break: false, lunch: false, shiftout: false });
      }
    } catch (error) {
      console.error("Error in liveFeedInitializer:", error);
    }
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (personalInfo.emp_id && token) {
      liveFeedInitializer();
    }
  }, [personalInfo.emp_id]);

  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      await axios.post(
        "http://localhost:8000/Sims/logout/",
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/loginpage";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAddTask = (newTask) => {
    setCurrentTasks([...currentTasks, newTask]);
    setCurrentPage("Tasks");
  };

  const handleViewHoursCalculator = () => {
    setShowHoursCalculator(true);
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/Sims/performance/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        console.log("Performance API Response:", response.data);

        if (response.data && response.data.status_counts) {
          setTaskStatusCounts(response.data.status_counts);
        } else {
          console.error("Error: `status_counts` is missing", response.data);
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setTaskStatusCounts({});
      }
    };

    fetchPerformanceData();
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const taskProgressChartData = {
    labels: Object.keys(taskStatusCounts),
    datasets: [
      {
        label: "Task Status",
        data: Object.values(taskStatusCounts),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#f44336",
          "#2196f3",
          "#9c27b0",
        ],
        borderRadius: 10,
      },
    ],
  };

  const hoursProgress = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Hours Worked",
        data: [25, 28, 31, 35],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const skillsData = {
    labels: ["JavaScript", "React", "Node.js", "SQL", "Python"],
    datasets: [
      {
        data: [80, 75, 60, 70, 65],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const [personalInfos, setPersonalInfos] = useState({
    name: "Loading...",
    email: "Loading...",
  });

  useEffect(() => {
    const fetchPersonalsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        const response4 = await axios.get(
          "http://localhost:8000/Sims/personal-data/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        console.log("Personal Data Response:", response4.data);

        setPersonalInfos({
          name: response4.data.username || "N/A",
          email: response4.data.email || "N/A",
          photo: response4.data.photo
            ? `http://localhost:8000${response4.data.photo}`
            : null,
        });
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchPersonalsData();
  }, []);

  const toggleStatusBarDetails = () => {
    setShowStatusBarDetails(!showStatusBarDetails);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Combined AppBar with Status Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: darkMode ? "#121212" : "#EFEFEF",
            boxShadow:
              "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
              minHeight: "64px",
            }}
          >
            {/* Left side - Logo and Menu */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={vdart}
                alt="Vdart Logo"
                style={{ height: "60px", marginRight: "8px" }}
              />
            </Box>
            {/* Center - Timer Status */}
            {timerActive && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexGrow: 1,
                  mx: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    onClick={toggleStatusBarDetails}
                    sx={{ mr: 1 }}
                  >
                    {showStatusBarDetails ? (
                      <KeyboardArrowUpIcon
                        sx={{ color: darkMode ? "white" : "black" }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ color: darkMode ? "white" : "black" }}
                      />
                    )}
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: darkMode ? "white" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    Current Shift: {formatTime(elapsedTime)}
                  </Typography>
                </Box>

                <Collapse
                  in={showStatusBarDetails}
                  timeout="auto"
                  unmountOnExit
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      mt: 1,
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mx: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "white" : "black",
                          mr: 1,
                        }}
                      >
                        Break: {formatTime(breakTime)}
                      </Typography>
                      <Button
                        variant="contained"
                        color={activeTimers.break ? "success" : "secondary"}
                        size="small"
                        onClick={toggleBreak}
                        disabled={activeTimers.lunch || activeTimers.shiftout}
                      >
                        {activeTimers.break ? "End Break" : "Start Break"}
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mx: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "white" : "black",
                          mr: 1,
                        }}
                      >
                        Lunch: {formatTime(lunchTime)}
                      </Typography>
                      <Button
                        variant="contained"
                        color={activeTimers.lunch ? "success" : "warning"}
                        size="small"
                        onClick={toggleLunch}
                        disabled={activeTimers.break || activeTimers.shiftout}
                      >
                        {activeTimers.lunch ? "End Lunch" : "Start Lunch"}
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mx: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "white" : "black",
                          mr: 1,
                        }}
                      >
                        Other: {formatTime(shiftOutTime)}
                      </Typography>
                      <Button
                        variant="contained"
                        color={activeTimers.shiftout ? "success" : "error"}
                        size="small"
                        onClick={toggleOthers}
                        disabled={activeTimers.break || activeTimers.lunch}
                      >
                        {activeTimers.shiftout ? "Back In" : "Go Out"}
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* Right side - Icons */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon
                    sx={{ color: darkMode ? "white" : "black" }}
                  />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationMenuClose}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>No notifications</MenuItem>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleNotificationMenuClose}
                    >
                      {notification.message}
                    </MenuItem>
                  ))
                )}
              </Menu>

              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Brightness7Icon sx={{ color: "white" }} />
                ) : (
                  <Brightness4Icon sx={{ color: "black" }} />
                )}
              </IconButton>

              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar
                  alt="Profile"
                  src={personalInfos?.photo || "/static/images/avatar/1.jpg"}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ color: darkMode ? "white" : "black" }}
                        >
                          {personalInfos.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ color: darkMode ? "white" : "black" }}
                        >
                          {personalInfos.email}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem disablePadding>
                  <ListItemButton onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" sx={{ color: "black" }} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      color: "red",
                      textDecoration: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        color: "red",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: "black" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1, mt: 8 }}>
          <Drawer
            variant="permanent"
            sx={{
              width: isSidebarOpen ? 250 : 80,
              flexShrink: 0,
              transition: "width 0.3s ease",
              "& .MuiDrawer-paper": {
                width: isSidebarOpen ? 250 : 80,
                transition: "width 0.3s ease",
                bgcolor: darkMode ? "rgba(255, 255, 255, 0.2)" : "#F5F5F5",
                color: darkMode ? "white" : "black",
                padding: "15px",
                marginTop: "64px",
                height: `calc(100% - 64px)`,
                overflow: "hidden",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {isSidebarOpen && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: darkMode ? "white" : "black" }}
                >
                  Intern Dashboard
                </Typography>
              )}
              <IconButton onClick={toggleSidebar} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />

            {isSidebarOpen && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1">Live Feed:</Typography>
                <Switch
                  checked={timerActive}
                  onChange={toggleTimer}
                  color="primary"
                />
                <Typography variant="body1" sx={{ ml: 1 }}></Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <List sx={{ flexGrow: 1 }}>
              {[
                {
                  text: "Dashboard",
                  icon: <HomeWorkIcon />,
                  page: "Dashboard",
                },
                { text: "Profile", icon: <PersonIcon />, page: "Profile" },
                {
                  text: "Payment Status",
                  icon: <CurrencyRupeeIcon />,
                  page: "Payment Status",
                },
                {
                  text: "Document View",
                  icon: <DescriptionIcon />,
                  page: "Document View",
                },
                {
                  text: "Asset Report",
                  icon: <FeedbackIcon />,
                  page: "Asset Report",
                },
                {
                  text: "Performance Feedback",
                  icon: <FeedbackIcon />,
                  page: "Performance Feedback",
                },
              ].map((item, index) => (
                <React.Fragment key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handlePageChange(item.page)}
                      selected={currentPage === item.page}
                    >
                      <ListItemIcon
                        sx={{ color: darkMode ? "white" : "black" }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {isSidebarOpen && (
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ color: darkMode ? "white" : "black" }}
                            >
                              {item.text}
                            </Typography>
                          }
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  {index < 5 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: darkMode ? "#121212" : "#EFEFEF",
              p: 3,
              overflowY: "auto",
              height: "calc(100vh - 64px)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                maxWidth: "1200px",
                margin: "0 auto",
                pl: 2,
              }}
            >
              {currentPage === "Document View" ? (
                <DocumentView darkMode={darkMode} />
              ) : currentPage === "Payment Status" ? (
                <PaymentStatusPage />
              ) : currentPage === "Profile" ? (
                <InternProfile personalInfo={personalInfo} />
              ) : showPerformanceOverview ? (
                <PerformancePage />
              ) : showHoursCalculator ? (
                <InternHoursCalculator
                  handleClose={() => setShowHoursCalculator(false)}
                />
              ) : currentPage === "Asset Report Issue" ? (
                <AssetReport />
              ) : currentPage === "Leave Management" ? (
                <LeaveManagement />
              ) : currentPage === "Asset Report" ? (
                <AssetReport />
              ) : currentPage === "Tasks" ? (
                <Tasks tasks={currentTasks} onPageChange={handlePageChange} />
              ) : currentPage === "Create Task" ? (
                <Create onAddTask={handleAddTask} />
              ) : currentPage === "AttendanceManagement" ? (
                <AttendanceManagement />
              ) : currentPage === "Performance Feedback" ? (
                <PerformanceFeedback />
              ) : currentPage === "Dashboard" ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Personal Information
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            justifyContent: "center",
                            mb: 3,
                          }}
                        >
                          <Avatar
                            alt="J"
                            src={personalInfo.photo}
                            sx={{ width: 56, height: 56 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          style={{
                            fontSize: "0.9rem",
                            color: darkMode ? "white" : "black",
                            textAlign: "center",
                          }}
                        >
                          <strong>Name:</strong> {personalInfo.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontSize: "0.9rem",
                            color: darkMode ? "white" : "black",
                            textAlign: "center",
                          }}
                        >
                          <strong>Department:</strong> {personalInfo.department}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontSize: "0.9rem",
                            color: darkMode ? "white" : "black",
                            textAlign: "center",
                          }}
                        >
                          <strong>Position:</strong> {personalInfo.position}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontSize: "0.9rem",
                            color: darkMode ? "white" : "black",
                            textAlign: "center",
                          }}
                        >
                          <strong>Contact:</strong> {personalInfo.contact}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Attendance Overview
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-flex",
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={attendancePercentage}
                              size={80}
                              thickness={4}
                              sx={{
                                color:
                                  attendancePercentage < 75
                                    ? "error.main"
                                    : attendancePercentage < 90
                                    ? "warning.main"
                                    : "success.main",
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                style={{
                                  fontSize: "0.8rem",
                                  color: darkMode ? "white" : "black",
                                }}
                              >
                                {`${attendancePercentage}%`}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            style={{
                              fontSize: "0.8rem",
                              marginTop: "10px",
                              color: darkMode ? "white" : "black",
                            }}
                          >
                            {`Present: ${presentDays} / ${totalDays} days`}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{
                              fontSize: "0.8rem",
                              color: darkMode ? "white" : "black",
                            }}
                          >
                            {`Leave Balance: ${leaveBalance} days`}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() =>
                              handlePageChange("AttendanceManagement")
                            }
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Leave Balance
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-flex",
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={(leaveBalance / 20) * 100}
                              size={80}
                              thickness={4}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                style={{
                                  fontSize: "0.8rem",
                                  color: darkMode ? "white" : "black",
                                }}
                              >
                                {leaveBalance}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            style={{
                              fontSize: "0.8rem",
                              marginTop: "10px",
                              color: darkMode ? "white" : "black",
                            }}
                          >
                            Remaining Leave Days
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => handlePageChange("Leave Management")}
                          >
                            Request Leave
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Task Progress
                        </Typography>

                        <Box sx={{ textAlign: "center" }}>
                          {Object.keys(taskStatusCounts).length > 0 ? (
                            <Pie
                              data={taskProgressChartData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                              }}
                            />
                          ) : (
                            <Typography>No task data available</Typography>
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => handlePageChange("Tasks")}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Weekly Performance Overview
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <Bar
                            data={performanceChartData}
                            options={performanceChartOptions}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => setShowPerformanceOverview(true)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Hours Calculation and Skills Assessment in the same row */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Hours Calculation
                        </Typography>
                        <Box sx={{ textAlign: "center", height: 200 }}>
                          <Line
                            data={hoursProgress}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={handleViewHoursCalculator}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: darkMode ? "#333" : "white",
                        borderRadius: "12px",
                        boxShadow: darkMode
                          ? "0px 4px 15px rgba(0, 0, 0, 0.5)"
                          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: darkMode
                            ? "0px 10px 25px rgba(0, 0, 0, 0.7)"
                            : "0px 10px 25px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: "1rem",
                            color: darkMode ? "white" : "black",
                          }}
                        >
                          Skills Assessment
                        </Typography>
                        <Box sx={{ height: 200 }}>
                          <Doughnut
                            data={skillsData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h6" component="div" sx={{ p: 2 }}>
                  {currentPage} Content goes here!
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Chatbot Floating Button */}
        <Fab
          color="primary"
          aria-label="chat"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: darkMode ? "#1976d2" : "#1976d2",
            "&:hover": {
              backgroundColor: darkMode ? "#1565c0" : "#1565c0",
            },
          }}
        >
          {chatOpen ? <KeyboardArrowDownIcon /> : <ChatIcon />}
          {isSpeaking && (
            <Box
              sx={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "red",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(0.95)", opacity: 0.7 },
                  "70%": { transform: "scale(1.3)", opacity: 0.3 },
                  "100%": { transform: "scale(0.95)", opacity: 0.7 },
                },
              }}
            />
          )}
        </Fab>

        {/* Chatbot Panel */}
        <Slide direction="up" in={chatOpen} mountOnEnter unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              width: 350,
              height: 500,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: darkMode ? "#424242" : "white",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box
              sx={{
                backgroundColor: darkMode ? "#1976d2" : "#1976d2",
                color: "white",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SmartToyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Tracktern Assistant</Typography>
              </Box>
              <IconButton color="inherit" onClick={toggleChat}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                backgroundColor: darkMode ? "#424242" : "#f5f5f5",
              }}
            >
              {messages.map((message, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    {message.sender === "bot" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1,
                          bgcolor: darkMode ? "#1976d2" : "#1976d2",
                        }}
                      >
                        {message.icon || <SmartToyIcon fontSize="small" />}
                      </Avatar>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        maxWidth: "80%",
                        backgroundColor:
                          message.sender === "user"
                            ? darkMode
                              ? "#1976d2"
                              : "#1976d2"
                            : darkMode
                            ? "#616161"
                            : "#e0e0e0",
                        color:
                          message.sender === "user"
                            ? "white"
                            : darkMode
                            ? "white"
                            : "black",
                        borderRadius:
                          message.sender === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        whiteSpace: "pre-line",
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                    {message.sender === "user" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          ml: 1,
                          bgcolor: darkMode ? "#333" : "#e0e0e0",
                        }}
                        src={personalInfo.photo}
                      >
                        {message.icon || <PersonIcon fontSize="small" />}
                      </Avatar>
                    )}
                  </Box>

                  {message.sender === "bot" && message.options && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                        justifyContent:
                          message.sender === "bot" ? "flex-start" : "flex-end",
                      }}
                    >
                      {message.options.map((option, idx) => (
                        <Chip
                          key={idx}
                          label={option}
                          size="small"
                          onClick={() => handleQuickOptionSelect(option)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.05)",
                            color: darkMode ? "white" : "black",
                            "&:hover": {
                              backgroundColor: darkMode
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              {botTyping && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: darkMode ? "#1976d2" : "#1976d2",
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: "80%",
                      backgroundColor: darkMode ? "#616161" : "#e0e0e0",
                      color: darkMode ? "white" : "black",
                      borderRadius: "18px 18px 18px 4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        "& > div": {
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.7)",
                          margin: "0 2px",
                          animation: "typing 1.4s infinite ease-in-out",
                          "@keyframes typing": {
                            "0%, 60%, 100%": { transform: "translateY(0)" },
                            "30%": { transform: "translateY(-5px)" },
                          },
                        },
                        "& > div:nth-of-type(1)": { animationDelay: "0s" },
                        "& > div:nth-of-type(2)": { animationDelay: "0.2s" },
                        "& > div:nth-of-type(3)": { animationDelay: "0.4s" },
                      }}
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${darkMode ? "#616161" : "#e0e0e0"}`,
                backgroundColor: darkMode ? "#424242" : "#f5f5f5",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={isListening ? stopListening : startListening}
                        color={isListening ? "error" : "default"}
                        edge="start"
                      >
                        <MicIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendMessage}
                        color="primary"
                        disabled={!inputMessage.trim() || botTyping}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: darkMode ? "#616161" : "white",
                    borderRadius: "24px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "24px",
                      paddingLeft: "8px",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 1,
                  color: darkMode
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
                }}
              >
                {isListening
                  ? "Listening... Speak now"
                  : "Press mic to use voice commands"}
              </Typography>
            </Box>
          </Paper>
        </Slide>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog open={confirmDialogOpen} onClose={cancelToggleTimerOff}>
          <DialogTitle>Confirm Stop Timer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to close todays shift?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelToggleTimerOff} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmToggleTimerOff} color="secondary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default App;