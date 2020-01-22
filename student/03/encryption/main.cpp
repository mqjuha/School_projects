#include <iostream>
#include <string>

using namespace std;

int kirjain_tarkastelu(string merkkijono) {
    long unsigned int loytyko;

    for ( char kirjain ='a'; kirjain <= 'z'; ++kirjain ) {
        loytyko = merkkijono.find(kirjain);
        if ( loytyko == string::npos) {
            return 1;
        }
    } return 0;
}

int kirjain_tarkastelu_toisinpain(string jono) {
    char merkki;
    int laskuri = 0;

    for (unsigned long int indeksi = 0; indeksi < jono.length(); ++indeksi) {
        merkki = jono.at(indeksi);

        for ( char kirjain ='a'; kirjain <= 'z'; ++kirjain ) {
            if ( merkki == kirjain) {
                laskuri += 1;
            }
        }

    } int maara = 0;
    maara = jono.length();
    if ( laskuri != maara) {
        return 1;
    }
    return 0;
}

int main()
{
    string avain = "";
    cout << "Enter the encryption key: ";
    getline(cin, avain);

    if ( avain.length() != 26 ) {
        cout << "Error! The encryption key must contain 26 characters." << endl;
    }
    else if ( kirjain_tarkastelu_toisinpain(avain) == 1 ) {
        cout << "Error! The encryption key must contain only lower case characters." << endl;

    }
    else if ( kirjain_tarkastelu(avain) == 1 ) {
        cout << "Error! The encryption key must contain all alphabets a-z." << endl;

    }
    else {
        string teksti = "";
        cout << "Enter the text to be encrypted: ";
        cin >> teksti;

        if ( kirjain_tarkastelu_toisinpain(teksti) == 1) {
            cout << "Error! The encryption key must contain only lower case characters." << endl;
        }
        else {
            for (unsigned long int indeksi = 0; indeksi < teksti.length(); ++indeksi) {
                char korvattava = teksti.at(indeksi);

                int aakkosindeksi = 0;

                for ( char kirjain ='a'; kirjain <= 'z'; ++kirjain ) {
                    if (kirjain == korvattava) {
                         teksti.at(indeksi) = avain.at(aakkosindeksi);

                    }
                    ++aakkosindeksi;
                }
            } cout << "Encrypted text: " << teksti << endl;

        }


    }

}
