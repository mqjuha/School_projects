#include "player.hh"
#include <string>

Player::Player(string nimi):
    nimi_(nimi), kaikkipts_(){
}
string Player::get_name() const {
    return nimi_;
}

int Player::get_points() const {
    return kaikkipts_;
}
void Player::add_points(int pts) {
    kaikkipts_ += pts;
    if (kaikkipts_ > 50) {
        kaikkipts_ = 25;
        cout << nimi_ << " gets penalty points!" << endl;
    }
}
int Player::has_won() const {
    if (kaikkipts_ == 50) {
        return true;
    } else {
        return false;
    }

}
