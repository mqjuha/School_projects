#include "mainwindow.hh"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->closeButton, SIGNAL(clicked()), this, SLOT(close()));
}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::on_countButton_clicked()
{
    paino_ = ui->weightLineEdit->text().toDouble();
    pituus_ = ui->heightLineEdit->text().toDouble();

    double pituus = pituus_/100;

    double painoindeksi = paino_/(pituus*pituus);

    ui->resultLabel->setNum(painoindeksi);

    if ( painoindeksi < 18.5){
        ui->infoTextBrowser->setText("You are underweight.");
    } else if ( painoindeksi > 25 ){
        ui->infoTextBrowser->setText("You are overweight.");
    } else {
        ui->infoTextBrowser->setText("Your weight is normal.");
    }

}
