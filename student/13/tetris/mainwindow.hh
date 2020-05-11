/* Tetris
 *
 * Class: Mainwindow
 * ----------
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */

#ifndef MAINWINDOW_HH
#define MAINWINDOW_HH

#include <QMainWindow>
#include <QGraphicsScene>
#include <random>
#include <QGraphicsRectItem>
#include <QTimer>
#include <vector>

using namespace std;

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

    void keyPressEvent(QKeyEvent* event) override;

private slots:
    void on_startHardButton_clicked();
    void on_startNormalButton_clicked();
    void on_holdButton_clicked();
    void on_continueButton_clicked();
    void on_newGameButton_clicked();

private:
    Ui::MainWindow *ui;

    QGraphicsScene* scene_;

    vector<QGraphicsRectItem*> tetromino_;

    vector<vector<int>> grid_;

    QTimer timer_;          // for continuous moving
    QTimer clock_timer_;    // duration of playing time

    // Tetrominos speed
    int speed_;
    double minutes_;
    double seconds_;
    double clock_;
    int points_;

    // Tetrominos' shapes
    vector<vector<vector<int>>> SHAPES = {
            { { 80, 0 },   { 100, 0 },   { 120, 0 },   { 140, 0 } }, //suora
            { { 100, 0 },  { 120, 0 },   { 100, 20 },  { 120, 20 } }, //neliö
            { { 100, 0 },  { 120, 0 },   { 140, 0 },   { 100, 20 } }, //L sininen
            { { 100, 0 },  { 120, 0 },   { 140, 0 },   { 140, 20 } }, //L tummapunan
            { { 120, 0 },  { 140, 0 },   { 120, 20 },   { 100, 20 } }, //Z vihree
            { { 100, 0 },   { 120, 0 },   { 120, 20 },   { 140, 20 } }, //Z punane
            { { 100, 0 },  { 120, 0 },  { 140, 0 },   { 120, 20 } }, //T
        };

    // Tetrominos' colors
    vector<QBrush> COLORS = { Qt::cyan, Qt::yellow, Qt::blue,
                                Qt::darkRed, Qt::green, Qt::red,
                                Qt::magenta };


    // Normal game starting speed and clock_timer_ speed
    const int NORMAL = 1000;
    // Hard game starting speed
    const int HARD = 500;

    // Place isn't free
    const int UNFREE = 1;

    // Constants describing scene coordinates
    const int BORDER_UP = 0;
    const int BORDER_DOWN = 480;
    const int BORDER_LEFT = 0;
    const int BORDER_RIGHT = 240;

    // Size of a tetromino component
    const int SQUARE_SIDE = 20;
    // Number of horizontal cells (places for tetromino components)
    const int COLUMNS = BORDER_RIGHT / SQUARE_SIDE;
    // Number of vertical cells (places for tetromino components)
    const int ROWS = BORDER_DOWN / SQUARE_SIDE;

    // How many steps tetromino always move
    const int STEP = 20;

    // Number of tetrominos
    const int NUMBER_OF_TETROMINOS = 7;

    // For randomly selecting the next dropping tetromino
    default_random_engine randomEng;
    uniform_int_distribution<int> distr;

    // Function creates a new shape
    void set_shape();

    // The tetromino automatically moves down the side of the square
    void tetromino_move();

    // Function checks that is it possible to move the tetromino
    bool is_place_free(qreal deltaX, qreal deltaY);

    // Playing time clock and the clock is running as the tetromino moves
    void clock_time();

    // Function create grid where there are only zeros at first
    void create_grid();

    // Function checks that is game over, is it possible
    // create a new tetromino
    bool is_game_over();
};

#endif // MAINWINDOW_HH
