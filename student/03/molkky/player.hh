#ifndef PLAYER_HH
#define PLAYER_HH
#include <iostream>
#include <string>

using namespace std;


class Player
{
    public:
        Player(string nimi);
        string get_name() const;
        int get_points() const;
        void add_points(int pts);
        int has_won() const;

    private:
        string nimi_;
        int kaikkipts_ = 0;
};

#endif // PLAYER_HH
