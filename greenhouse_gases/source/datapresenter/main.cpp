#include "mainwindow.hh"
#include "model.hh"
#include "controller.hh"

#include <QApplication>
#include <QFile>
#include "concretestatfi.hh"

#include "concretesmear.hh"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    // Load an application style
    QFile styleFile( "stylesheet.qss" );
    styleFile.open( QFile::ReadOnly );

    // Apply the loaded stylesheet
    QString style = QLatin1String( styleFile.readAll() );
    a.setStyleSheet( style );

    Model* model{new Model()};
    Controller* controller{new Controller(model)};
    MainWindow* view{new MainWindow(controller)};

    model->setView(view);
    model->setupView();
    view->show();

    return a.exec();
}
