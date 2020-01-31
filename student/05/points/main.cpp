#include <iostream>
#include <fstream>
#include <string>
#include <map>

using namespace std;

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

        map<string, int> pisteet;

        cout << "Final scores:" << endl;

        string rivi;

        while ( getline(tiedosto_olio, rivi )) {
            int erottaja = rivi.find(":");

            string nimi = rivi.substr(0,erottaja);
            int luku = rivi.substr(erottaja+1);

            if ( pisteet.find(nimi) != pisteet.end() ) {
                pisteet.at(nimi) += luku;

            } else {
                pisteet.insert( {nimi, luku} );
            }


        } tiedosto_olio.close();

        map<string, int>::iterator iter;

        for ( iter = pisteet.begin(); iter != pisteet.end(); ++iter) {
            cout << iter->first << ": " << iter->second << endl;
        }


    }



}
