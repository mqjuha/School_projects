#include <iostream>
#ifndef RECURSIVE_FUNC
#define RECURSIVE_FUNC
#endif

using namespace std;

void print_vertical(unsigned int num)
{
    RECURSIVE_FUNC
    // Do not remove RECURSIVE_FUNC declaration, it's necessary for automatic testing to work
    // ------------

    // Add your implementation here
    //std::cout << num << endl;
    unsigned jakaja = 10;
    unsigned jakojaannos = 0;
    unsigned numero;

    if (num > 10) {
        numero = num / jakaja;
        jakojaannos = num % jakaja;
        print_vertical(numero);
        cout << jakojaannos << endl;
    }
    else {
        cout << num << endl;
    }


}

// Do not modify rest of the code, or the automated testing won't work.
#ifndef UNIT_TESTING
int main()
{
    unsigned int number = 0;
    cout << "Enter a number: ";
    cin >> number;
    cout << "The given number (" << number << ") written vertically:" << endl;
    print_vertical(number);
    return 0;
}
#endif
