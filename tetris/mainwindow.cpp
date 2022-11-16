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
 * */

#include "mainwindow.hh"
#include "ui_mainwindow.h"
#include <QTimer>
#include <QKeyEvent>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    minutes_(0.00),
    seconds_(0.00),
    clock_(0.00),
    points_(0)
{
    ui->setupUi(this);

    // A graphics scene in which to draw rectangles
    scene_ = new QGraphicsScene(this);

    // The graphicsView object is placed on the window
    // at the following coordinates
    int left_margin = 100; // x coordinate
    int top_margin = 150; // y coordinate

    // The width of the graphicsView is BORDER_RIGHT added by 2,
    // since the borders take one pixel on each side
    // (1 on the left, and 1 on the right).
    // Similarly, the height of the graphicsView is BORDER_DOWN added by 2.
    ui->graphicsView->setGeometry(left_margin, top_margin,
                                  BORDER_RIGHT + 2, BORDER_DOWN + 2);
    ui->graphicsView->setScene(scene_);

    // The width of the scene_ is BORDER_RIGHT decreased by 1 and
    // the height of it is BORDER_DOWN decreased by 1, because
    // each square of a tetromino is considered to be inside the sceneRect,
    // if its upper left corner is inside the sceneRect.
    scene_->setSceneRect(0, 0, BORDER_RIGHT - 1, BORDER_DOWN - 1);

    // A non-singleshot timer fires every interval (speed_) milliseconds,
    // which makes tetromino_move function to be called,
    // until the timer is stopped
    timer_.setSingleShot(false);
    connect(&timer_, &QTimer::timeout, this, &MainWindow::tetromino_move);

    // Time how long the game lasts
    connect(&clock_timer_, &QTimer::timeout, this, &MainWindow::clock_time);
    ui->lcd_number_clock->setStyleSheet("background-color: cyan");

    // Setting random engine ready for the first real call.
    int seed = time(0);
    randomEng.seed(seed);
    distr = uniform_int_distribution<int>(0, NUMBER_OF_TETROMINOS - 1);
    distr(randomEng); // Wiping out the first random number
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::keyPressEvent(QKeyEvent *event)
{
    // The tetromino moves to the right
    if ( event->key() == Qt::Key_N ) {
        qreal deltaX = STEP;
        qreal deltaY = 0;
        if ( is_place_free(deltaX, deltaY) ) {
            for ( QGraphicsRectItem* piece : tetromino_ ){
                piece->moveBy(deltaX, deltaY);
            }
        }
    }

    // The tetromino moves to the left
    if ( event->key() == Qt::Key_V ) {
        qreal deltaX = -STEP;
        qreal deltaY = 0;
        if ( is_place_free(deltaX, deltaY) ) {
            for ( QGraphicsRectItem* piece : tetromino_ ){
                piece->moveBy(deltaX, deltaY);
            }
        }
    }

    // The tetromino goes straight down
    if ( event->key() == Qt::Key_B ){
        qreal deltaX = 0;
        qreal deltaY = STEP;
        while ( is_place_free(deltaX, deltaY) ){
            for ( QGraphicsRectItem* piece : tetromino_ ){
                piece->moveBy(deltaX, deltaY);
            }
        }
    }
}

void MainWindow::set_shape()
{
    if ( is_game_over() ){
        timer_.stop();
        clock_timer_.stop();
        ui->game_over_browser->setText("GAME OVER!!!");

    } else {
        ui->game_over_browser->setText("GOOD LUCK!!!");

        // The same shape always has the same color
        int shape = distr(randomEng) % 8;
        QBrush colorBrush(COLORS.at(shape));
        QPen grayPen(Qt::gray);
        grayPen.setWidth(2);
        for ( int i = 0; i < 4 ; i++ ){
            int x = SHAPES.at(shape).at(i).at(0);
            int y = SHAPES.at(shape).at(i).at(1);
            QGraphicsRectItem* piece = scene_->addRect(0, 0, SQUARE_SIDE,
                                            SQUARE_SIDE, grayPen, colorBrush);
            piece->moveBy(x, y);
            tetromino_.push_back(piece);
        }

        // The player gets a point for each new tetromino
        points_ += 1;
        ui->points_label->setNum(points_);

        // Always release the holdButton for a new tetromino
        ui->hold_button->setDisabled(false);
    }
}

void MainWindow::tetromino_move()
{   
    // Change in transition
    qreal deltaX = 0;
    qreal deltaY = STEP;
    
    if ( is_place_free(deltaX, deltaY) ){
        for ( QGraphicsRectItem* piece : tetromino_ ){
            piece->moveBy(deltaX, deltaY);
        }
        return;
    }

    // The number one is marked in the grid_ when the tetromino stops
    for ( QGraphicsRectItem* piece : tetromino_ ){
        int current_x = piece->x()/STEP;
        int current_y = piece->y()/STEP;
        grid_.at(current_y).at(current_x) = UNFREE;
    }

    // The game speeds up with each new tetromino
    if ( speed_ > 20 ){
        speed_ -= 20;
        timer_.start(speed_);
    }
    tetromino_.clear();
    set_shape();
}

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
        if ( grid_.at(y).at(x) == UNFREE){
            return false;
        }
    }
    return true;
}

void MainWindow::clock_time()
{
    seconds_ += 0.01;

    if (seconds_ >= 0.60){
        ++ minutes_;
        seconds_ = 0.00;
    }
    clock_ = minutes_ + seconds_;
    ui->lcd_number_clock->display(clock_);
}

void MainWindow::create_grid()
{
   vector<int> colums;

   // Set to zero at each place
   for ( int x = 0; x <= COLUMNS; x++ ){
       colums.push_back(0);
   }
   for ( int y = 0; y <= ROWS; y++ ){
       grid_.push_back(colums);
   }
}

// Return:
// true = the game is over
// false = the game can continue
bool MainWindow::is_game_over()
{
    for ( int place : grid_.at(1) ){
        if ( place == UNFREE ){
            return true;
        }
    }
    return false;
}

// Function starts a new hard game
void MainWindow::on_start_hard_button_clicked()
{
    // Tetrominos move faster than in normal game
    speed_ = HARD;
    timer_.start(speed_);
    clock_timer_.start(NORMAL);
    create_grid();
    set_shape();

    ui->start_hard_button->setDisabled(true);
    ui->start_normal_button->setDisabled(true);
}

// Function starts a new normal game
void MainWindow::on_start_normal_button_clicked()
{
    // Tetrominos move slower than in hard game
    speed_ = NORMAL;
    timer_.start(speed_);
    clock_timer_.start(NORMAL);
    create_grid();
    set_shape();

    ui->start_hard_button->setDisabled(true);
    ui->start_normal_button->setDisabled(true);
}

// The tetromino stops and the holdButton can't be pressed
// until the next tetromino
void MainWindow::on_hold_button_clicked()
{
    timer_.stop();
    ui->hold_button->setDisabled(true);
}

// Function continue game after holdButton
void MainWindow::on_continue_button_clicked()
{
    timer_.start(speed_);
}

// Function clears the scene and allows a new game
void MainWindow::on_new_game_button_clicked()
{
    scene_->clear();
    tetromino_.clear();
    grid_.clear();
    clock_timer_.stop();
    points_ = 0;
    minutes_ = 0.00;
    seconds_ = 0.00;
    clock_ = minutes_ + seconds_;
    ui->lcd_number_clock->display(clock_);
    ui->points_label->setNum(points_);
    ui->game_over_browser->setText("Choose which game you want start!");

    ui->start_hard_button->setDisabled(false);
    ui->start_normal_button->setDisabled(false);
    ui->hold_button->setDisabled(false);
}
