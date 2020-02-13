#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <set>
#include <vector>

using namespace std;

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

    }vektori.push_back(jono);
    return vektori;

}

void print(map<string, set<int>> data) {

    for(pair<string, set<int>> sanapari : data) {

        cout << sanapari.first;
        cout << " " << sanapari.second.size();
        cout << ": ";

        for(set<int>::iterator iter = sanapari.second.begin(); iter != sanapari.second.end(); ++ iter) {

            if (iter == sanapari.second.begin()) {
                cout << *iter;
            } else {
                cout << ", " << *iter;
            }
        } cout << endl;
    }
}

int main()
{
    string tiedosto = "";
    cout << "Input file: ";
    getline(cin, tiedosto);

    ifstream tiedosto_olio(tiedosto);

    if ( not tiedosto_olio ) {
        cout << "Error! The file " << tiedosto << " cannot be opened." << endl;
        return EXIT_FAILURE;
    }
    else {

        map<string, set<int>> sanat = {};

        int rivin_numero = 1;

        string rivi = "";


        while ( getline(tiedosto_olio, rivi )) {

            vector<string> split_rivi = split(rivi, ' ', true);
            for(string sana : split_rivi) {

                if(sanat.find(sana) == sanat.end()) {
                    sanat[sana] = {rivin_numero};
                } else {
                    sanat.at(sana).insert(rivin_numero);
                }
            }
            ++ rivin_numero;

        }
        tiedosto_olio.close();

        print(sanat);
    }

}
