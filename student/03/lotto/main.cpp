#include <iostream>

using namespace std;

int pallojen_maara;
int arvottavien_maara;


unsigned long int kertoma(int luku) {
    unsigned long int tulos = 1;

    while ( luku > 0 ) {
        tulos = tulos * luku;
        --luku;
    }
    return tulos;
}

int main()
{
    cout << "Enter the total number of lottery balls: ";
    cin >> pallojen_maara;

    cout << "Enter the number of drawn balls: ";
    cin >> arvottavien_maara;

    if (pallojen_maara < 0 or arvottavien_maara < 0) {
        cout << "The number of balls must be a positive number." << endl;
    } else if (pallojen_maara < arvottavien_maara) {
        cout << "The maximum number of drawn balls is the total amount of balls." << endl;
    } else {

        unsigned long int n = kertoma(pallojen_maara);
        unsigned long int p = kertoma(arvottavien_maara);
        unsigned long int np = kertoma(pallojen_maara - arvottavien_maara);

        unsigned long int todennakosyys = n / (np * p);

        cout << "The probability of guessing all " << arvottavien_maara << " balls correctly is 1/" << todennakosyys << endl;
    }


}
