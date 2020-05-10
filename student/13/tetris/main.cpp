/* Tetris
 *
 * Desc:
 * Tetris is game where you try to make as many tetromino as possible
 * fit in the same area. There are seven shapes of pieces and they drop from top.
 * They can be moved sideways.
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */

#include "mainwindow.hh"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();

    return a.exec();
}
