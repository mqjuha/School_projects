/* Tetris
 *
 * Class: mainwindow
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * Notes:
 *
 * */

#include "mainwindow.hh"
#include "ui_mainwindow.h"
#include <QTimer>
#include <QKeyEvent>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    points_(0),
    minutes_(0.00),
    seconds_(0.00),
    clock_(0.00)
{
    ui->setupUi(this);

    // We need a graphics scene in which to draw rectangles.
    scene_ = new QGraphicsScene(this);
   // scene2_ = new QGraphicsScene(this);

    // The graphicsView object is placed on the window
    // at the following coordinates, but if you want
    // different placement, you can change their values.
    int left_margin = 100; // x coordinate
    int top_margin = 150; // y coordinate

    // The width of the graphicsView is BORDER_RIGHT added by 2,
    // since the borders take one pixel on each side
    // (1 on the left, and 1 on the right).
    // Similarly, the height of the graphicsView is BORDER_DOWN added by 2.
    ui->graphicsView->setGeometry(left_margin, top_margin,
                                  BORDER_RIGHT + 2, BORDER_DOWN + 2);
    ui->graphicsView->setScene(scene_);

    //ui->graphicsView_2->setGeometry(160, 10, 120 + 2, 120 + 2);
    //ui->graphicsView_2->setScene(scene2_);

    // The width of the scene_ is BORDER_RIGHT decreased by 1 and
    // the height of it is BORDER_DOWN decreased by 1, because
    // each square of a tetromino is considered to be inside the sceneRect,
    // if its upper left corner is inside the sceneRect.
    scene_->setSceneRect(0, 0, BORDER_RIGHT - 1, BORDER_DOWN - 1);


    // A non-singleshot timer fires every interval (1000) milliseconds,
    // which makes circle_move function to be called,
    // until the timer is stopped
    timer_.setSingleShot(false);
    connect(&timer_, &QTimer::timeout, this, &MainWindow::tetromino_move);

    connect(&clock_timer_, &QTimer::timeout, this, &MainWindow::clock_time);
    ui->lcdNumberClock->setStyleSheet("background-color: cyan");


    // Setting random engine ready for the first real call.
    int seed = time(0); // You can change seed value for testing purposes
    randomEng.seed(seed);
    distr = uniform_int_distribution<int>(0, NUMBER_OF_TETROMINOS - 1);
    distr(randomEng); // Wiping out the first random number (which is almost always 0)
    // After the above settings, you can use randomEng to draw the next falling
    // tetromino by calling: distr(randomEng) in a suitable method.

    // Add more initial settings and connect calls, when needed.
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::keyPressEvent(QKeyEvent *event)
{
    // tetromino moves to the right
    if(event->key() == Qt::Key_N) { 
        qreal deltaX = STEP;
        qreal deltaY = 0;
        if ( is_place_free(deltaX, deltaY) ) {
            for ( QGraphicsRectItem* piece : tetromino_ ){
                piece->moveBy(deltaX, deltaY);
            }
        }
    }

    // tetromino moves to the left
    if(event->key() == Qt::Key_V) {
        qreal deltaX = -STEP;
        qreal deltaY = 0;
        if ( is_place_free(deltaX, deltaY) ) {
            for ( QGraphicsRectItem* piece : tetromino_ ){
                piece->moveBy(deltaX, deltaY);
            }
        }
    }
}

// Function draws and creates a new shape
void MainWindow::set_shape()
{
    if ( is_game_over() ){
        timer_.stop();
        clock_timer_.stop();
        ui->gameOverBrowser->setText("GAME OVER!!!");
        //ui->gameOverBrowser->set(clock_);

    } else {
        ui->gameOverBrowser->setText("GOOD LUCK!!!");

        // The same shape always has the same color
        int shape = distr(randomEng)%8;
        QBrush colorBrush(allColors.at(shape));
        QPen grayPen(Qt::gray);
        grayPen.setWidth(2);

        for (int i = 0; i < 4 ; i++){
            int x = allShapes.at(shape).at(i).at(0);
            int y = allShapes.at(shape).at(i).at(1);
            QGraphicsRectItem* piece = scene_->addRect(0, 0, SQUARE_SIDE, SQUARE_SIDE, grayPen, colorBrush);
            piece->moveBy(x, y);
            tetromino_.push_back(piece);
        }
        // Pisteen saa jokaisesta uudesta palikasta
        points_ += 1;
        ui->pointsLabel->setNum(points_);
        // vapautetaan hold nappi aina uuden palikan kohdalla
        ui->holdButton->setDisabled(false);
    }
}

// The tetromino automatically moves downthe side of the square
void MainWindow::tetromino_move()
{   
    // Change in transition
    qreal deltaX = static_cast<qreal>(0);
    qreal deltaY = static_cast<qreal>(STEP);
    
    if ( is_place_free(deltaX, deltaY) ){
        for ( QGraphicsRectItem* piece : tetromino_ ){
            piece->moveBy(deltaX, deltaY);
        }
        return;
    }
    // jos ei pysty siirtää niin laitetaan griddiin ykkönen
    for ( QGraphicsRectItem* piece : tetromino_ ){
        int current_x = piece->x()/STEP;
        int current_y = piece->y()/STEP;
        grid_.at(current_y).at(current_x) = 1;
    }
    tetromino_.clear();
    set_shape();
}

// Function checks that is it possible to move the tetromino
// Parameters:
// deltaX = transfer with respect to the x-axis
// deltaY = transfer with respect to the y-axis.
// Return:
// true = possible
// false = not possible
bool MainWindow::is_place_free(qreal deltaX, qreal deltaY )
{
    // If the new position isn't already taked or isn't out of te scene
    // the tetromino can move
    for ( QGraphicsRectItem* piece : tetromino_ ){
        qreal current_x = piece->x();
        qreal current_y = piece->y();
        int x = piece->x()/STEP;
        int y = piece->y()/STEP;
        current_x += deltaX;
        current_y += deltaY;
        y += 1;
        if ( not scene_->sceneRect().contains(current_x, current_y) ){
            return false;
        }
        if ( grid_.at(y).at(x) == 1){
            return false;
        }
    }
    return true;
}

// Playing time clock and the clock is running as the pieces move
void MainWindow::clock_time()
{
    seconds_ += 0.01;

    if (seconds_ >= 0.60){
        ++ minutes_;
        seconds_ = 0.00;
    }
    clock_ = minutes_ + seconds_;
    ui->lcdNumberClock->display(clock_);
}

void MainWindow::create_grid()
{
   vector<int> row;

   // asetetaan jokaiselle riville nolla
   for ( int x = 0; x <= BORDER_RIGHT/STEP; x++ ){
       row.push_back(0);
   }
   // rivejä ony-akselin verran
   for ( int y = 0; y <= BORDER_DOWN/STEP; y++ ){
       grid_.push_back(row);
   }
}

bool MainWindow::is_game_over()
{
    for ( int alkio : grid_.at(0) ){
        if ( alkio == 1 ){
            return true;
        }
    }
    return false;
}

// Tetrominos move faster than in normal game
void MainWindow::on_startHardButton_clicked()
{
    timer_.start(HARD);
    clock_timer_.start(NORMAL);
    is_normal_ = false;
    create_grid();
    set_shape();

    ui->startHardButton->setDisabled(true);
    ui->startNormalButton->setDisabled(true);
}

// Tetrominos move slower than in hard game
void MainWindow::on_startNormalButton_clicked()
{
    timer_.start(NORMAL);
    clock_timer_.start(NORMAL);
    is_normal_ = true;
    create_grid();
    set_shape();

    ui->startHardButton->setDisabled(true);
    ui->startNormalButton->setDisabled(true);
}

// The tetromino stops and the holdButton can't be pressed until the nest tetromino
void MainWindow::on_holdButton_clicked()
{
    timer_.stop();
    ui->holdButton->setDisabled(true);
}

// Function continue game
void MainWindow::on_continueButton_clicked()
{
    if ( is_normal_ ){
        timer_.start(NORMAL);
    } else {
        timer_.start(HARD);
    }
}
