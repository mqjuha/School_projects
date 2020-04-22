#include "mainwindow.hh"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    timer(new QTimer(this)),
    ui(new Ui::MainWindow),
    minutes_(0),
    seconds_(0)
{
    ui->setupUi(this);

    connect(timer, SIGNAL(timeout()), this, SLOT(seconds_gone()));
    connect(ui->stopButton, SIGNAL(clicked()), this, SLOT(stop_Button()));
    connect(ui->closeButton, SIGNAL(clicked()), this, SLOT(close()));

    ui->lcdNumberSec->setStyleSheet("background-color: green");
    ui->lcdNumberMin->setStyleSheet("background-color: darkcyan");
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::seconds_gone()
{
    ++seconds_;

    if (seconds_ >= 60){
        ++minutes_;
        seconds_ = 0;
    }
    ui->lcdNumberSec->display(seconds_);
    ui->lcdNumberMin->display(minutes_);
}

void MainWindow::stop_Button()
{
    timer->stop();
}

void MainWindow::on_startButton_clicked()
{
    timer->start(1000);
}

void MainWindow::on_resetButton_clicked()
{
    seconds_ = 0;
    minutes_ = 0;

    ui->lcdNumberSec->display(seconds_);
    ui->lcdNumberMin->display(minutes_);
}

void MainWindow::on_pushButton_4_clicked()
{
    close();
}
