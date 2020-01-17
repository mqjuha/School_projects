#include <iostream>

using namespace std;

int main()
{
    double lampotila;
    cout << "Enter a temperature: ";
    cin >> lampotila;

    cout << lampotila << " degrees Celsius is " << lampotila * 1.8 + 32
         << " degrees Fahrenheit" << endl;
    cout << lampotila << " degrees Fahrenheit is " << (lampotila - 32) / 1.8
         << " degrees Celsius" << endl;

    // Write your code here

    return 0;
}
