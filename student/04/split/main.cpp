#include <iostream>
#include <string>
#include <vector>


// TODO: Implement split function here
// Do not change main function

std::vector<std::string> split(std::string merkkijono, char erottaja, bool totuusarvo = false) {

    std::vector<std::string> vektori = { };
    std::string jono = "";

    for ( std::string::size_type indeksi = 0; indeksi < merkkijono.size(); ++indeksi) {

        if ( merkkijono.at(indeksi) != erottaja ) {
            jono += merkkijono.at(indeksi);
        }
        else {
            if (totuusarvo) {
                if (jono.size() != 0) {
                    vektori.push_back(jono);

                    jono = "";
                }
            } else {

                vektori.push_back(jono);

                jono = "";

            }

        }
    } long unsigned int viimeinen = merkkijono.rfind(erottaja);
    if ( viimeinen != merkkijono.size() -1) {
        int pituus = merkkijono.size() - viimeinen;
        vektori.push_back(merkkijono.substr(viimeinen + 1, pituus - 1));
    }
    return vektori;

}


int main()
{
    std::string line = "";
    std::cout << "Enter a string: ";
    getline(std::cin, line);
    std::cout << "Enter the separator character: ";
    char separator = getchar();

    std::vector< std::string > parts  = split(line, separator);
    std::cout << "Splitted string including empty parts: " << std::endl;
    for( auto part : parts ) {
        std::cout << part << std::endl;
    }

    std::vector< std::string > parts_no_empty  = split(line, separator, true);
    std::cout << "Splitted string ignoring empty parts: " << std::endl;
    for( auto part : parts_no_empty ) {
        std::cout << part << std::endl;
    }
}
