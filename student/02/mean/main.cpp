#include <iostream>

// Write here a function counting the mean value
double laskettavat_numerot;
double uusi_numero;
double maara;

int main()
{
    std::cout << "From how many integer numbers you want to count the mean value? ";
    std::cin >> maara;

    if (maara < 1) {
        std::cout << "Cannot count mean value from " << maara << " numbers" << std::endl;
    } else {
        for (int jarjestys_luku = 1; jarjestys_luku <= maara; ++jarjestys_luku) {
            std::cout << "Input " << jarjestys_luku << ". number: ";
            std::cin >> uusi_numero;

            laskettavat_numerot += uusi_numero;
        }
        std::cout << "Mean value of the given numbers is " << laskettavat_numerot / maara
                   << std::endl;
    }
}
