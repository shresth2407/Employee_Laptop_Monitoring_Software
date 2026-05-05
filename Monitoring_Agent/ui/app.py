import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtGui import QFont, QIcon
from PyQt5.QtCore import Qt

from ui.login_window import LoginWindow


def apply_global_styles(app):
    app.setStyleSheet("""
        QWidget {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
        }
    """)


def run_app():
    app = QApplication(sys.argv)

    # ================= APP SETTINGS =================
    app.setApplicationName("Employee Monitoring System")

    # Optional: set app icon (add icon.png in your project)
    try:
        app.setWindowIcon(QIcon("assets/icon.png"))
    except:
        pass

    # Smooth font
    app.setFont(QFont("Segoe UI", 10))

    # Apply global styling
    apply_global_styles(app)

    # ================= START WINDOW =================
    window = LoginWindow()
    window.show()

    sys.exit(app.exec_())


if __name__ == "__main__":
    run_app()