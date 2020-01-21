#include <iostream>

using namespace std;

int luku;

int main(){

    cout << "Enter a number: ";
    cin >> luku;

    if (luku * luku * luku >= 0) {
        cout << "The cube of " << luku << " is " << luku * luku * luku << "." << endl;

    } else {
        cout << "Error! The cube of " << luku << " is not " << luku * luku * luku << "." << endl;
    }
}
