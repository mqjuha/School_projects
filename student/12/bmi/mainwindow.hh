#ifndef MAINWINDOW_HH
#define MAINWINDOW_HH

#include <QMainWindow>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private slots:

    void on_countButton_clicked();

private:
    Ui::MainWindow *ui;
    double paino_;
    double pituus_;
};

#endif // MAINWINDOW_HH
