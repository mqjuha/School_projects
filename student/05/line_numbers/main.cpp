#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main()
{
    string input_tiedosto = "";
    cout << "Input file: ";
    getline(cin, input_tiedosto);

    string output_tiedosto = "";
    cout << "Output file: ";
    getline(cin, output_tiedosto);

    ifstream tiedosto_olio(input_tiedosto);

       if ( not tiedosto_olio ) {
           cout << "Error! The file " << input_tiedosto << " cannot be opened." << endl;
           return EXIT_FAILURE;

       } else {

           ofstream tiedosto_olio2(output_tiedosto);

           string tekstirivi = "";
           int luku = 1;

           while ( getline(tiedosto_olio, tekstirivi )) {
               tiedosto_olio2 << luku << " " << tekstirivi << endl;

               luku += 1;
               string tekstirivi = "";

           } tiedosto_olio2.close();

       } tiedosto_olio.close();

}
