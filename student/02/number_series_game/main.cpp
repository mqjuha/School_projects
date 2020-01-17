#include <iostream>


int main()
{
    int maara;
    std::cout << "How many numbers would you like to have? ";
    std::cin >> maara;

    for ( int luku = 1; luku <= maara; ++luku) {
        if ( luku % 21 == 0) {
            std::cout << "zip boing" << std::endl;
        } else if (luku % 7 == 0) {
            std::cout << "boing" << std::endl;
        } else if (luku % 3 == 0) {
            std::cout << "zip" << std::endl;
        } else {
            std::cout << luku << std::endl;
        }
    }
}
