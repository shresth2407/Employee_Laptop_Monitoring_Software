import sys
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLineEdit, QPushButton,
    QLabel, QHBoxLayout, QFrame, QApplication, QGraphicsDropShadowEffect, QSpacerItem, QSizePolicy
)
from PyQt5.QtCore import Qt, QPropertyAnimation, QEasingCurve, QPoint
from PyQt5.QtGui import QFont, QColor, QPalette, QIcon

# Placeholder imports - Ensure these files exist in your directory
from core.agent_controller import AgentController
from ui.dashboard_window import DashboardWindow

class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()

        # Window Config
        self.setWindowTitle("Secure Guard | Employee Monitoring")
        self.showMaximized()
        self.setMinimumSize(1100, 800)

        # MAIN LAYOUT (Vertical)
        self.main_layout = QVBoxLayout()
        self.main_layout.setContentsMargins(0, 0, 0, 0)
        self.main_layout.setSpacing(0)

        # ================= BACKGROUND CONTAINER =================
        self.bg_container = QFrame()
        self.bg_container.setObjectName("bgContainer")
        self.bg_container.setStyleSheet("""
            #bgContainer {
                background: qradialgradient(
                    cx: 0.5, cy: 0.5, radius: 1.2,
                    fx: 0.5, fy: 0.5,
                    stop: 0 #1e293b, 
                    stop: 1 #020617
                );
            }
        """)
        self.bg_layout = QVBoxLayout(self.bg_container)
        self.bg_layout.setContentsMargins(0, 0, 0, 0)
        self.bg_layout.setSpacing(0)

        # ================= 1. HEADER BAR =================
        self.header_bar = QFrame()
        self.header_bar.setFixedHeight(70)
        self.header_bar.setStyleSheet("background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid rgba(255,255,255,0.05);")
        header_layout = QHBoxLayout(self.header_bar)
        header_layout.setContentsMargins(30, 0, 30, 0)

        logo_title = QLabel("🛡️ SECURE<b>GUARD</b>")
        logo_title.setStyleSheet("color: #f8fafc; font-size: 18px; letter-spacing: 2px;")
        
        system_status = QLabel("● SYSTEM OPERATIONAL")
        system_status.setStyleSheet("color: #10b981; font-size: 11px; font-weight: bold; letter-spacing: 1px;")

        header_layout.addWidget(logo_title)
        header_layout.addStretch()
        header_layout.addWidget(system_status)

        # ================= 2. CENTRAL CONTENT =================
        central_content = QWidget()
        central_layout = QVBoxLayout(central_content)
        central_layout.setAlignment(Qt.AlignCenter)

        # LOGIN CARD
        self.card = QFrame()
        self.card.setFixedWidth(440)
        self.card.setObjectName("loginCard")
        self.card.setStyleSheet("""
            #loginCard {
                background-color: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 28px;
            }
        """)
        
        # Premium Glow Shadow
        shadow = QGraphicsDropShadowEffect(self)
        shadow.setBlurRadius(60)
        shadow.setXOffset(0)
        shadow.setYOffset(20)
        shadow.setColor(QColor(0, 0, 0, 200))
        self.card.setGraphicsEffect(shadow)

        card_layout = QVBoxLayout(self.card)
        card_layout.setContentsMargins(45, 50, 45, 50)
        card_layout.setSpacing(12)

        # Header Section in Card
        title = QLabel("Welcome Back")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color: #ffffff; font-size: 32px; font-weight: 800; font-family: 'Segoe UI';")

        subtitle = QLabel("Authorized Personnel Only")
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #94a3b8; font-size: 13px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;")

        # Input Fields
        self.email = QLineEdit()
        self.email.setPlaceholderText("Organization Email")
        self.email.setMinimumHeight(55)
        self.email.setStyleSheet(self.input_style())

        self.password = QLineEdit()
        self.password.setPlaceholderText("Access Code")
        self.password.setEchoMode(QLineEdit.Password)
        self.password.setMinimumHeight(55)
        self.password.setStyleSheet(self.input_style())

        self.status = QLabel("")
        self.status.setAlignment(Qt.AlignCenter)
        self.status.setStyleSheet("font-size: 12px; font-weight: 500; margin: 5px 0;")

        # Premium Button
        self.login_btn = QPushButton("SIGN IN")
        self.login_btn.setCursor(Qt.PointingHandCursor)
        self.login_btn.setMinimumHeight(55)
        self.login_btn.setStyleSheet(self.button_style())
        self.login_btn.clicked.connect(self.handle_login)

        card_layout.addWidget(title)
        card_layout.addWidget(subtitle)
        card_layout.addWidget(self.email)
        card_layout.addWidget(self.password)
        card_layout.addWidget(self.status)
        card_layout.addWidget(self.login_btn)

        central_layout.addWidget(self.card)

        # ================= 3. FOOTER BAR =================
        self.footer_bar = QFrame()
        self.footer_bar.setFixedHeight(50)
        self.footer_bar.setStyleSheet("background: transparent; border-top: 1px solid rgba(255,255,255,0.03);")
        footer_layout = QHBoxLayout(self.footer_bar)
        footer_layout.setContentsMargins(30, 0, 30, 0)

        copyright_info = QLabel("© 2026 Secure Guard Technologies Inc.")
        copyright_info.setStyleSheet("color: #475569; font-size: 11px;")
        
        version_info = QLabel("v4.2.0-Enterprise")
        version_info.setStyleSheet("color: #475569; font-size: 11px;")

        footer_layout.addWidget(copyright_info)
        footer_layout.addStretch()
        footer_layout.addWidget(version_info)

        # Assembly
        self.bg_layout.addWidget(self.header_bar)
        self.bg_layout.addWidget(central_content)
        self.bg_layout.addWidget(self.footer_bar)

        self.main_layout.addWidget(self.bg_container)
        self.setLayout(self.main_layout)

    # ================= REFINED PREMIUM STYLES =================
    def input_style(self):
        return """
            QLineEdit {
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 14px;
                padding: 0 18px;
                color: #f1f5f9;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 1px solid #6366f1;
                background-color: rgba(15, 23, 42, 0.9);
            }
        """

    def button_style(self):
        return """
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #4f46e5, stop:1 #7c3aed);
                color: #ffffff;
                border-radius: 14px;
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 1px;
                border: none;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #6366f1, stop:1 #8b5cf6);
            }
            QPushButton:pressed {
                background: #3730a3;
                padding-top: 2px;
            }
        """

    # ================= LOGIC (UNCHANGED) =================
    def handle_login(self):
        email = self.email.text()
        password = self.password.text()

        # Logic kept exactly as per your request
        self.agent = AgentController(email, password)
        self.status.setText("⌛ ANALYZING BIOMETRIC DATA...")
        self.status.setStyleSheet("color: #60a5fa;") 

        if not self.agent.login():
            self.status.setText("⚠️ ACCESS DENIED. CHECK CREDENTIALS.")
            self.status.setStyleSheet("color: #fb7185;") 
            return

        self.status.setText("🚀 IDENTITY VERIFIED. WELCOME.")
        self.status.setStyleSheet("color: #34d399;") 
        
        self.agent.start_monitoring()
        self.dashboard = DashboardWindow(self.agent)
        self.dashboard.show()
        self.close()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = LoginWindow()
    window.show()
    sys.exit(app.exec_())