#include "mainwindow.hh"
#include "ui_mainwindow.h"
#include <QTimer>
#include <QKeyEvent>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    points_(0),
    minutes_(0),
    seconds_(0)
{
    ui->setupUi(this);

    //connect(timer_, SIGNAL(timeout()), this, SLOT(seconds_gone()));

    // We need a graphics scene in which to draw rectangles.
    scene_ = new QGraphicsScene(this);
    scene2_ = new QGraphicsScene(this);

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

    ui->graphicsView_2->setGeometry(160, 10, 120 + 2, 120 + 2);
    ui->graphicsView_2->setScene(scene2_);

    // The width of the scene_ is BORDER_RIGHT decreased by 1 and
    // the height of it is BORDER_DOWN decreased by 1, because
    // each square of a tetromino is considered to be inside the sceneRect,
    // if its upper left corner is inside the sceneRect.
    scene_->setSceneRect(0, 0, BORDER_RIGHT - 1, BORDER_DOWN - 1);

    set_shape();

    // A non-singleshot timer fires every interval (1000) milliseconds,
    // which makes circle_move function to be called,
    // until the timer is stopped
    timer_.setSingleShot(false);
    connect(&timer_, &QTimer::timeout, this, &MainWindow::tetromino_move);


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
        int can_move_right = 0;
        qreal deltaX = STEP;
        qreal deltaY = 0;
        for ( QGraphicsRectItem* square : tetromino_ ){
            if(scene_->sceneRect().contains(square->x() + deltaX, square->y()) && is_place_free(deltaX, deltaY)) {
                can_move_right += 1;
            }
        } if ( can_move_right == 4 ){
            tetromino_.at(0)->moveBy(deltaX, deltaY);
            tetromino_.at(1)->moveBy(deltaX, deltaY);
            tetromino_.at(2)->moveBy(deltaX, deltaY);
            tetromino_.at(3)->moveBy(deltaX, deltaY);
        }
        return;
    }
    // tetromino moves to the left
    if(event->key() == Qt::Key_V) {
        int can_move_left = 0;
        qreal deltaX = -STEP;
        qreal deltaY = 0;
        for ( QGraphicsRectItem* square : tetromino_ ){
            if(scene_->sceneRect().contains(square->x() + deltaX, square->y()) && is_place_free(deltaX, deltaY)) {
                can_move_left += 1;
            }
        } if ( can_move_left == 4 ){
            tetromino_.at(0)->moveBy(deltaX, deltaY);
            tetromino_.at(1)->moveBy(deltaX, deltaY);
            tetromino_.at(2)->moveBy(deltaX, deltaY);
            tetromino_.at(3)->moveBy(deltaX, deltaY);
        }
        return;
    }

    // tetrimono goes straight down
    // KESKEN
    if(event->key() == Qt::Key_Space) {
    }
}

// Function draws and creates a new shape
void MainWindow::set_shape()
{
    // The same shape always has the same color
    int shape = distr(randomEng)%8;
    QBrush colorBrush(allColors.at(shape));
    QPen grayPen(Qt::gray);
    grayPen.setWidth(2);
    for (int i = 0; i < 4 ; i++){
        int x = allShapes.at(shape).at(i).at(0);
        int y = allShapes.at(shape).at(i).at(1);
        square_ = scene_->addRect(SQUARE_SIDE*x+80, SQUARE_SIDE*y, SQUARE_SIDE,
                                  SQUARE_SIDE, grayPen, colorBrush);
        tetromino_.push_back(square_);
    }
    // Pisteen saa jokaisesta uudesta palikasta
    points_ += 1;
    ui->pointsLabel->setNum(points_);
    // vapautetaan hold nappi aina uuden palikan kohdalla
    ui->holdButton->setDisabled(false);
}

// The tetromino automatically moves downthe side of the square
void MainWindow::tetromino_move()
{
    // Current position of the tetromino
    qreal current_y = tetromino_.at(0)->y();
    qreal current_y1 = tetromino_.at(1)->y();
    qreal current_y2 = tetromino_.at(2)->y();
    qreal current_y3 = tetromino_.at(3)->y();
    qreal current_x = tetromino_.at(0)->x();
    qreal current_x1 = tetromino_.at(1)->x();
    qreal current_x2 = tetromino_.at(2)->x();
    qreal current_x3 = tetromino_.at(3)->x();
    
    // Change in transition
    qreal deltaX = 0;
    qreal deltaY = STEP;
    
    // New position of the tetromino
    current_y += deltaY;
    current_y1 += deltaY;
    current_y2 += deltaY;
    current_y3 += deltaY;

    if ( is_place_free( deltaX, deltaY) && current_y < 400 && current_y1 < 400 && current_y2 < 400 && current_y3 < 400) {
        tetromino_.at(0)->moveBy(deltaX, deltaY);
        tetromino_.at(1)->moveBy(deltaX, deltaY);
        tetromino_.at(2)->moveBy(deltaX, deltaY);
        tetromino_.at(3)->moveBy(deltaX, deltaY);
    } else {
        taked_places_.push_back( {current_x, (current_y - STEP)} );
        taked_places_.push_back( {current_x1, (current_y1 - STEP)} );
        taked_places_.push_back( {current_x2, (current_y2 - STEP)} );
        taked_places_.push_back( {current_x3, (current_y3 - STEP)} );
        tetromino_.clear();
        set_shape();
    }

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
    QRectF rect = scene_->sceneRect();
    for ( vector<qreal> coordinate : taked_places_){
        for ( QGraphicsRectItem* square : tetromino_){
            qreal next_coordination_x = square->x() + deltaX;
            qreal next_coordination_y = square->y() + deltaY;
            if ( coordinate.at(0) == next_coordination_x && coordinate.at(1) == next_coordination_y){
                return false;
            } else if ( not rect.contains(next_coordination_x, next_coordination_y) ){
                 return false;
            }
        }
    } return true;
}

void MainWindow::clock_time()
{
    ++seconds_;

    if (seconds_ >= 60){
        ++minutes_;
        seconds_ = 0;
    }
    //ui->lcdNumberSec->display(seconds_);
    //ui->lcdNumberMin->display(minutes_);
}

// Tetrominos move faster than in normal game
void MainWindow::on_startHardButton_clicked()
{
    timer_.start(300);
    ui->startNormalButton->setDisabled(true);
    ui->startHardButton->setText("Continue Hard Game");
}

// Tetrominos move slower than in hard game
void MainWindow::on_startNormalButton_clicked()
{
    timer_.start(1000);
    ui->startHardButton->setDisabled(true);
    ui->startNormalButton->setText("Continue Normal Game");
}

// The tetromino stops and the holdButton can't be pressed until the nest tetromino
void MainWindow::on_holdButton_clicked()
{
    timer_.stop();
    ui->holdButton->setDisabled(true);
}
