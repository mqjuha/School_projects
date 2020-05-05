#include "mainwindow.hh"
#include "ui_mainwindow.h"
#include <QTimer>
#include <QKeyEvent>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

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
        if(scene_->sceneRect().contains(tetromino_.at(0)->x() + 20, tetromino_.at(0)->y())) {
            tetromino_.at(0)->moveBy(20, 0);
        }
        return;
    }
    // tetromino moves to the left
    if(event->key() == Qt::Key_V) {
        if(scene_->sceneRect().contains(tetromino_.at(0)->x() - 20, tetromino_.at(0)->y())) {
            tetromino_.at(0)->moveBy(-20, 0); // ei mene lähtö paikasta enempää vasemmalle
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

void MainWindow::tetromino_move()
{
    for (int i = 0; i < 4 ; i++){
        // Current position of the square
        qreal current_x = tetromino_.at(i)->x();
        qreal current_y = tetromino_.at(i)->y();
    
        // Change in transition
        qreal deltaX = 0;
        qreal deltaY = SQUARE_SIDE;
    
        // New position of the square
        current_x += deltaX;
        current_y += deltaY;

        if (current_y < 400) {
            tetromino_.at(i)->moveBy(deltaX, deltaY);
        } else {
            tetromino_.clear();
            set_shape();
        }
    
        // If the new position isn't already taked the tetromino can move
        /*for ( vector<qreal> coordinate : filled_boxes_){
            if ( coordinate.at(0) == current_x && coordinate.at(0) == current_y) {
                current_y = current_y - deltaY;

                // when tetromino can't anymore move it is added to vector where is
                // all coordinates which are already filled
                vector<qreal> filled_coodinates = {current_x, current_y};
                filled_boxes_.push_back( filled_coodinates );
                tetromino_.clear();
                set_shape();
            } else {
                tetromino_.at(i)->moveBy(deltaX, deltaY);
            }
        }*/
    }
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

void MainWindow::on_holdButton_clicked()
{
    timer_.stop();
    ui->holdButton->setDisabled(true);
}
