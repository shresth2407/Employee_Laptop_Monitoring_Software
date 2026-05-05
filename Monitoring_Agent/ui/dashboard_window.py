import sys
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QPushButton, 
    QFrame, QHBoxLayout, QGraphicsDropShadowEffect, QSpacerItem, QSizePolicy
)
from PyQt5.QtCore import Qt, QTimer, QTime
from PyQt5.QtGui import QColor, QFont

class DashboardWindow(QWidget):
    def __init__(self, agent):
        super().__init__()

        self.agent = agent
        # Timer setup for "Time on Duty"
        self.work_time = QTime(0, 0, 0)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_work_timer)
        self.timer.start(1000) # Update every 1 second

        # Window Config
        self.setWindowTitle("Secure Guard | Command Center")
        self.showMaximized()
        self.setMinimumSize(1200, 800)

        # Main Layout
        self.main_layout = QVBoxLayout()
        self.main_layout.setContentsMargins(0, 0, 0, 0)
        self.main_layout.setSpacing(0)

        # ================= BACKGROUND =================
        self.bg_container = QFrame()
        self.bg_container.setObjectName("bgContainer")
        self.bg_container.setStyleSheet("""
            #bgContainer {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 #0f172a, stop:1 #1e293b);
            }
        """)
        self.bg_layout = QVBoxLayout(self.bg_container)
        self.bg_layout.setContentsMargins(0, 0, 0, 0)

        # ================= HEADER BAR =================
        self.header_bar = QFrame()
        self.header_bar.setFixedHeight(90) # Increased height
        self.header_bar.setStyleSheet("background: rgba(15, 23, 42, 0.6); border-bottom: 2px solid rgba(99, 102, 241, 0.2);")
        header_layout = QHBoxLayout(self.header_bar)
        header_layout.setContentsMargins(50, 0, 50, 0)

        title_label = QLabel("🛡️ SECURE<b>GUARD</b> <span style='color: #6366f1;'>PRO</span>")
        title_label.setStyleSheet("color: #f8fafc; font-size: 24px; letter-spacing: 2px; font-family: 'Segoe UI Semibold';")
        
        logout_btn = QPushButton("TERMINATE SESSION")
        logout_btn.setCursor(Qt.PointingHandCursor)
        logout_btn.setFixedSize(220, 45)
        logout_btn.setStyleSheet(self.logout_button_style())
        logout_btn.clicked.connect(self.logout)

        header_layout.addWidget(title_label)
        header_layout.addStretch()
        header_layout.addWidget(logout_btn)

        # ================= CENTRAL CONTENT =================
        content_area = QWidget()
        content_layout = QHBoxLayout(content_area)
        content_layout.setContentsMargins(60, 40, 60, 40)
        content_layout.setSpacing(40)

        # --- LEFT SIDE: STATUS CARD ---
        self.card = QFrame()
        self.card.setFixedWidth(550)
        self.card.setObjectName("dashCard")
        self.card.setStyleSheet("""
            #dashCard {
                background-color: rgba(30, 41, 59, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 35px;
            }
        """)
        
        card_shadow = QGraphicsDropShadowEffect(self)
        card_shadow.setBlurRadius(80)
        card_shadow.setColor(QColor(0, 0, 0, 150))
        self.card.setGraphicsEffect(card_shadow)

        card_layout = QVBoxLayout(self.card)
        card_layout.setContentsMargins(50, 60, 50, 60)
        card_layout.setSpacing(30)

        # 1. System Status Badge
        status_color = "#10b981" if agent.monitoring_active else "#f43f5e"
        self.status_lbl = QLabel("SYSTEM OPERATIONAL")
        self.status_lbl.setStyleSheet(f"color: {status_color}; font-size: 16px; font-weight: 900; letter-spacing: 4px;")
        self.status_lbl.setAlignment(Qt.AlignCenter)

        # 2. WORK TIMER (The enhancement you asked for)
        timer_container = QVBoxLayout()
        timer_label_hint = QLabel("TOTAL WORK DURATION")
        timer_label_hint.setStyleSheet("color: #94a3b8; font-size: 14px; letter-spacing: 2px;")
        timer_label_hint.setAlignment(Qt.AlignCenter)
        
        self.timer_display = QLabel("00:00:00")
        self.timer_display.setStyleSheet("""
            color: #ffffff; 
            font-size: 72px; 
            font-weight: 800; 
            font-family: 'Consolas', 'Monospace';
            margin: 10px 0px;
        """)
        self.timer_display.setAlignment(Qt.AlignCenter)
        
        timer_container.addWidget(timer_label_hint)
        timer_container.addWidget(self.timer_display)

        # 3. User Details
        details_frame = QFrame()
        details_frame.setStyleSheet("background: rgba(15, 23, 42, 0.5); border-radius: 20px; padding: 20px;")
        details_layout = QVBoxLayout(details_frame)
        
        self.user_lbl = self.create_info_label("OPERATOR ID", agent.email)
        self.session_lbl = self.create_info_label("SESSION", f"#{agent.session_id}")
        
        details_layout.addWidget(self.user_lbl)
        details_layout.addSpacing(10)
        details_layout.addWidget(self.session_lbl)

        card_layout.addWidget(self.status_lbl)
        card_layout.addLayout(timer_container)
        card_layout.addWidget(details_frame)

        # --- RIGHT SIDE: WELCOME PANEL ---
        welcome_panel = QVBoxLayout()
        welcome_panel.setAlignment(Qt.AlignVCenter)
        
        big_welcome = QLabel(f"Hello,\n{agent.email.split('@')[0].capitalize()}")
        big_welcome.setStyleSheet("color: white; font-size: 56px; font-weight: 800; line-height: 1.2;")
        
        desc = QLabel("Your activity is currently being monitored for security compliance. Please maintain professional standards.")
        desc.setWordWrap(True)
        desc.setStyleSheet("color: #94a3b8; font-size: 20px; line-height: 1.5; margin-top: 20px;")
        
        welcome_panel.addWidget(big_welcome)
        welcome_panel.addWidget(desc)

        content_layout.addWidget(self.card)
        content_layout.addLayout(welcome_panel)

        # Final Assembly
        self.bg_layout.addWidget(self.header_bar)
        self.bg_layout.addWidget(content_area)
        
        self.main_layout.addWidget(self.bg_container)
        self.setLayout(self.main_layout)

    def update_work_timer(self):
        """Increments the timer every second."""
        self.work_time = self.work_time.addSecs(1)
        self.timer_display.setText(self.work_time.toString("HH:mm:ss"))

    def create_info_label(self, title, value):
        label = QLabel(f"<span style='color: #6366f1; font-weight: bold;'>{title}:</span> &nbsp; <span style='color: #f1f5f9;'>{value}</span>")
        label.setStyleSheet("font-size: 18px;") # Larger font
        return label

    def logout_button_style(self):
        return """
            QPushButton {
                background: #f43f5e;
                color: white;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 1px;
            }
            QPushButton:hover {
                background: #e11d48;
            }
            QPushButton:pressed {
                background: #9f1239;
            }
        """

    def logout(self):
        self.agent.shutdown()
        self.close()