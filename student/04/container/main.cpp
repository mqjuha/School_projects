#include <cstdlib>
#include <iostream>
#include <vector>

void read_integers(std::vector< int >& ints, int count)
{
    int new_integer = 0;

    for(int i = 0; i < count; ++i)
    {
        std::cin >> new_integer;
        // TODO: Implement your solution here
        ints.push_back(new_integer);
    }
}

// TODO: Implement your solution here

int same_values(std::vector<int> vektori) {

    for ( long unsigned int vektorin_alkio : vektori ) {
        if ( vektorin_alkio != vektori.at(0)) {
            return 0;
        }
    } return 1;
}

int is_ordered_non_strict_ascending(std::vector<int> vektori){

    int luku = 0;

    for ( long unsigned int indeksi = 0; indeksi < vektori.size(); ++indeksi) {
        if ( vektori.at(indeksi) < luku ) {
            return 0;
        }luku = vektori.at(indeksi);
    } return 1;
}

int is_arithmetic_series(std::vector<int> vektori) {

    int eka_erotus = vektori.at(1) - vektori.at(0);

    for ( long unsigned int indeksi = 0; indeksi < ( vektori.size() - 1); ++indeksi) {
        int erotus = vektori.at(indeksi + 1) - vektori.at(indeksi);

        if (eka_erotus != erotus) {
            return 0;
        }
    } return 1;
}

int is_geometric_series(std::vector<int> vektori) {

    int eka_jako = vektori.at(1) / vektori.at(0);

    for ( long unsigned int indeksi = 0; indeksi < ( vektori.size() - 1 ); ++indeksi) {
        int jako = vektori.at(indeksi + 1) / vektori.at(indeksi);
        if (eka_jako != jako) {
            return 0;
        }
    } return 1;
}

int main()
{
    std::cout << "How many integers are there? ";
    int how_many = 0;
    std::cin >> how_many;

    std::cout << "Enter the integers: ";
    std::vector<int> integers;
    read_integers(integers, how_many);

    if(same_values(integers))
        std::cout << "All the integers are the same" << std::endl;
    else
        std::cout << "All the integers are not the same" << std::endl;

    if(is_ordered_non_strict_ascending(integers))
        std::cout << "The integers are in a non-strict ascending order" << std::endl;
    else
        std::cout << "The integers are not in a non-strict ascending order" << std::endl;

    if(is_arithmetic_series(integers))
        std::cout << "The integers form an arithmetic series" << std::endl;
    else
        std::cout << "The integers do not form an arithmetic series" << std::endl;

    if(is_geometric_series(integers))
        std::cout << "The integers form a geometric series" << std::endl;
    else
        std::cout << "The integers do not form a geometric series" << std::endl;

    return EXIT_SUCCESS;
}
