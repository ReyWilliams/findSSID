// This program calculates the X-Y coordinates of the receiver position's based on RFID power read
#include <iostream>
#include <sstream>
#include<math.h>
#include<cmath>
#include <string>
#include <fstream>
#include <stdlib.h>
#include <ctime>
#include <unistd.h>
using namespace std;

const double CELLSIZE = 0.1;		// Size of the cell defined to 10cm
// Max power specified by the manufacturer
const double TAG0_MAX_POWER = 25;		// Power emitted by tag 0 at zero distance in dB
const double TAG1_MAX_POWER = 25;		// Power emitted by tag 1 at zero distance in dB
const double TAG2_MAX_POWER = 25;		// Power emitted by tag 2 at zero distance in dB
const double TIME_INTERVAL = 1.5;		// Tie between sampling data in seconds
const double GAIN = 1;			// Combined Gain for tag and receiver
const double FREQUENCY = 433.92;		// Operational frequency in MHz
const double ALPHA = 1.0;		// Proportionality constant measured to evaluate distance
const bool GRID = true;			// These constants control what is being transmitted to Data Processing
const bool POSITION = false;
const double C = 2.998*pow(10,8);	// Light speed
const char TAG0NUMBER = '4';		//Tag number related to physical tags
const char TAG1NUMBER = '6';
const char TAG2NUMBER = '7';
const double POWERTH = 48;		// This power Threshold is used to cahnge the equation of distance calculation

class TagDistance
{
public:
	TagDistance();					// Default constructor. Set all values to zero
	TagDistance(double, double, double, double);	// Constructor that sets the values of maxPower Gain and FreqSquare. Power given in dB, Gain in units and freq. in MHz
							// and the constant Alpha
	void SetMaxDistance(double);			// Calculates and returns the distance of the tag from the origin
	void SetCurrentDistance(double);		// Calculates and return the current distance of the tag
	void SetMaxPower(double);			// Sets the maximum power for each tag
	double GetMaxPower();				// Returns the value of max power read
	double GetMaxDistance();
	double GetCurrentDistance();
private:
	double maxPower;				// Tag Tx power at distance zero Range from -25 to -80dB
	double currentPower;				// Measurement receive from sensor
	double maxDistance;				// Distance of tag from origin
	double currentDistance;				// Calculated distance
	double Gain;					// Combined antenna gain of Transmitter and Receiver
	double Frequency;				// Receives the the operational frequency in Hz
	double Alpha;					// Proportionality constant to evaluate the distance
};

class AreaGrid
{
public:
	AreaGrid();			//Default constructor. Set all values to zero;
	void SetAreaGrid(double, double, double);	// Constructor that sets the value of cellSize in meters and calculates the grid
					// Inputs are cell size and the distances to the corners
	int GetXaxisLength();		// returns the length of the X axis. Inputs are distance of axes and cell size
	int GetYaxisLength();		// returns the length of the X axis. Inputs are distance of axes and cell size
private:
	double corner1Distance;		// Distance in meters from origin to corner 1 of area (This the Y axis distance)
	double corner2Distance;		// Distance in meters from origin to corner 2 of area
	int YaxisLength;			// Number of position on the y axix of the grid      **60
	int XaxisLength;			// Number of position on the x axix of the grid
	double cellSize;			// Size of the measurement cell in meters
};

class ReceiverLocation
{
public:
	ReceiverLocation();			// Default constructor. Sets all values to zero
	ReceiverLocation(double, double);	// Constructor that sets the values of the cell size and corner 1 distance
	int GetXcoordinate(double, double);	// calculates & returns the x coordinate of the receiver based on its distance to tags 2 and 0
	int GetYcoordinate(double, double);	// calculates & returns the y coordinate of the receiver based on its distance to tags 1 and 0
	void SetCornerDistances(double Corner1, double Corner2);	// Sets the distance to corner 1(Y axis) and corner 2 (X axis)
private:
	double corner1Distance;			// Distance from origin to tag1 located in the immediate next corner from origin
	double corner2Distance;
	double distanceTag0;				// Distance to the tag at the origin
	double distanceTag1;				// Distance to the tag on corner 1 (Y axis location)
	double distanceTag2;				// Distance to the tag on corner 2 (X axis location)
	int Xcoordinate;					// Number of positions on the x axis of the grid
	int Ycoordinate;					// Number of position on the y axis of the grid
	double cellSize;					// Size of the measurement cell in meters
};

ReceiverLocation::ReceiverLocation()
{
	corner1Distance = corner2Distance = distanceTag0 = distanceTag1 = distanceTag2 = Xcoordinate = Ycoordinate = cellSize = 0;
}

ReceiverLocation::ReceiverLocation(double Size, double Corner) 
{
	cellSize = Size;
	corner1Distance = corner2Distance = Corner;
	distanceTag0 = distanceTag1 = distanceTag2 = Xcoordinate = Ycoordinate = 0;			
}

void ReceiverLocation::SetCornerDistances(double Corner1, double Corner2)
{
	corner1Distance = Corner1;
	corner2Distance = Corner2;
}

int ReceiverLocation::GetXcoordinate(double Tag0Distance, double Tag2Distance)	// Returns the X coordinate based on the distances to Ta0 and tag2
{
	double cosA;					// Receives the value of the cosine of the angle at tag1 using low of cosines
	double Xdistance;				// Receives the calculated distance on the y axis
	cosA = (pow(corner2Distance, 2.0) + pow(Tag0Distance, 2.0) - pow(Tag2Distance, 2.0)) / (2 * corner2Distance * Tag0Distance);
	cosA = abs(cosA);
	// Error Correction section. Option 1. Uses the diffrenece between CosTag1 and 1
	//if (cosTag1 > 1) cosTag1 = cosTag1 - 1;
	// Error correction Option 2. Uses the difference between 1 and cosTag1
	// if(cosTag1 > 1) cosTag1 = 1 - cosTag1;
	
	Xdistance = cosA * Tag0Distance;
	Xcoordinate = Xdistance / cellSize;
	//***BORRAR
	cout << "cosA: " << cosA << endl;
	//***BORRAR
	return Xcoordinate;
}

int ReceiverLocation::GetYcoordinate(double Tag0Distance, double Tag1Distance)
{
	double cosB;					// Receives the value of the cosine of the angle at tag1 using low of cosines
	double Ydistance;				// Receives the calculated distance on the y axis
	cosB = (pow(corner1Distance, 2.0) + pow(Tag0Distance, 2.0) - pow(Tag1Distance, 2.0)) / (2 * corner1Distance * Tag0Distance);
	cosB = abs(cosB);
	// Error Correction section. Option 1. Uses the diffrenece between CosTag1 and 1
	//if (cosTag0 > 1) cosTag0 = cosTag0 - 1;
	// Error correction Option 2. Uses the difference between 1 and cosTag1
	// if(cosTag0 > 1) cosTag0 = 1 - cosTag0;
	
	Ydistance = Tag0Distance * cosB;		
	Ycoordinate = Ydistance / cellSize;
	return Ycoordinate;
}

int AreaGrid::GetXaxisLength()
{
	return XaxisLength;
}

int AreaGrid::GetYaxisLength()
{
	return YaxisLength;
}

void AreaGrid::SetAreaGrid(double Size, double Distance1, double Distance2)
{
	double XDistance;
	cellSize = Size;			
	corner1Distance = Distance1;
	corner2Distance = Distance2;
	//XDistance = sqrt(abs(pow(corner2Distance, 2.0) - pow(corner1Distance, 2.0)));
	YaxisLength = corner1Distance / cellSize;
	XaxisLength = corner2Distance / cellSize;
	//XaxisLength = XDistance / cellSize;
}

AreaGrid::AreaGrid()
{
	YaxisLength = XaxisLength = cellSize = corner1Distance = corner2Distance = 0;
}

double TagDistance::GetMaxPower()
{
	return maxPower;
}

void TagDistance::SetCurrentDistance(double Power)	// Power is given in neg dB from 25 to 80
{
	double CurrentPowerWatts, MaxPowerWatts;
	currentPower = Power;
	if (currentPower < maxPower)
		maxPower = currentPower;
	CurrentPowerWatts = pow(10.0, (-currentPower / 10));		// Translate current power read in dB to watts
	MaxPowerWatts = pow(10.0, (-maxPower / 10));			// Translates max power red in dB to watts
	//***BORRAR
	cout << "PowerWatts for CurrentDistance" << CurrentPowerWatts << endl;
	//***BORRAR
	if(currentPower < POWERTH)
		currentDistance = pow(((pow(C, 2) * Gain * MaxPowerWatts) / (pow((4 * M_PI * Frequency), 2) * CurrentPowerWatts)), (1 / 2.7));
	else
		currentDistance = pow(((pow(C, 2) * Gain * MaxPowerWatts) / (pow((4 * M_PI * Frequency), 2) * CurrentPowerWatts)), (1 / 2.7));
	
}

double TagDistance::GetMaxDistance()
{
	return maxDistance;
}

double TagDistance::GetCurrentDistance()
{
	return currentDistance;
}

void TagDistance::SetMaxDistance(double Power)
{
	double CurrentPowerWatts, MaxPowerWatts;
	currentPower = Power;
	if (currentPower < maxPower)
		maxPower = currentPower;
	CurrentPowerWatts = pow(10.0,(-currentPower/10));		// Translate current power read in dB to watts
	MaxPowerWatts = pow(10.0, (-maxPower / 10));			// Translates max power red in dB to watts
	//***BORRAR
	cout << "For MaxDistance. Current power in watts: " << CurrentPowerWatts << ". Max power in watts: " << MaxPowerWatts << endl;
	//***BORRAR
	if(currentPower < POWERTH)
		maxDistance = pow(((pow(C, 2) * Gain * MaxPowerWatts) / (pow((4 * M_PI * Frequency), 2) * CurrentPowerWatts)), (1 / 2.7));
	else 	
		maxDistance = pow(((pow(C, 2) * Gain * MaxPowerWatts) / (pow((4 * M_PI * Frequency), 2) * CurrentPowerWatts)), (1 / 2.7));	
}

void TagDistance::SetMaxPower(double Power)		// Sets max power to the value input, only if it is less than what is stored
{
	if (Power < maxPower)
		maxPower = Power;
}							

TagDistance::TagDistance()
{
	maxPower = currentPower = maxDistance = currentDistance = Gain = Frequency = Alpha = 0;
}

TagDistance::TagDistance(double Power, double GainIn, double FrequencyIn, double Constant)	// Gain is given in units, power in dB and frequency in MHz
{
	maxPower = Power;
	Alpha = Constant;
	Gain = GainIn;
	Frequency = FrequencyIn*1000000;
	currentPower = maxDistance = currentDistance = 0;
}


void ReadPower(ifstream& Filename, double& Tag0, double& Tag1, double& Tag2);	// Reads power values from the receiver connected to the USB port
void Transmit(ofstream& Data, int X_Grid_value, int Y_Grid_value, int X_value, int Y_value);	// Transmit the values of the grid size and the coordinates
double AsciiToDouble (char Number);												// Converts Ascii into a double number
void Acknowledge(ofstream& ComFile, string Word);								// Returns the comand that was last received					

int main()
{
	double PowerTag0, PowerTag1, PowerTag2;			// Receive the reading from the receiver connected to the USB cable
	double MaximumPower;							// Receives the evaluated maximum power among the tags for homogius calculations
	int YaxisPartitions, XaxisPartitions;			// receive the number of partitions of both axis to form the grid
	int X_coordinate, Y_coordinate;					// Receive the X and Y coordinates of the robot's position
	char PowerData[25];								// Receives the 25 character information from the RFID Reader
	char Command[4];								// Receives the command for the program to execute
	bool Q=true;									// Flag to control the execution of te main loop
	int i=0;
		
	ifstream USBport;								// Input stream variable to receive the file where USB data is located
	ifstream CommFile;								// Input stream for file contaning commands from the Control subsystem
	ofstream DataOutFile;							// Output stream to place the location information
	ofstream ConfirmFile;							// Output file to confirm the reseption of a comand from the user
	// Overwriting the COMM.txt file at start
	ofstream TEMPFile;
	TEMPFile.open("/home/pi/Desktop/Parsing/COMM.txt"); 	// This file will have the commands for this program to execute
	if (CommFile.fail())
	{
		cout << "Error opening COMM.txt" << endl;	
		exit(1);
	}
	TEMPFile << "HOL" << endl;
	TEMPFile.close();
	// Overwriting the DATA.txt file at start
	DataOutFile.open("/home/pi/Desktop/Parsing/DATA.txt"); 
	if (DataOutFile.fail())
	{
		cout << "Error opening Data File" << endl;
		//exit(1);
	}
	DataOutFile << i << endl;
	DataOutFile.close();
	   
	
	// Initial set up of variables and grid size
	
	TagDistance Tag0(TAG0_MAX_POWER, GAIN, FREQUENCY, ALPHA);	// Instance of Tag0 with its max values set
	TagDistance Tag1(TAG1_MAX_POWER, GAIN, FREQUENCY, ALPHA);	// Instance of Tag1 with its max values set
	TagDistance Tag2(TAG2_MAX_POWER, GAIN, FREQUENCY, ALPHA);	// Instance of Tag2 with its max values set

	ReceiverLocation Receiver(CELLSIZE,6);				// Instance for the location of the receiver created at the origin with default distance to corner1 and 2
	AreaGrid Grid;										// Instance for the grid with default distances to corner1 and corner2
		
	// Eternal loop for getting power information, calculating position and comunicating that position.
	
	while (Q)
	{
		//usleep(5000);											// Small delay to allo
		//USBport.open("/dev/ttyUSB0");							// Opens the port for data
		//if (USBport.fail()) 
		//{
		//	cout <<"Error opening /dev/ttyUSB0" << endl;	
		//	exit(1);
		//}			
		CommFile.open("/home/pi/Desktop/Parsing/COMM.txt"); 	// This file will have the commands for this program to execute
		if (CommFile.fail())
		{
			cout << "Error opening COMM.txt" << endl;	
			exit(1);
		}			
		
		CommFile >> Command;

		//***BORRAR
		cout<<"Command received: " << Command << endl << endl;
		//***BORRAR
		
		switch (Command[0])
		{
			case 'C': ReadPower(USBport, PowerTag0, PowerTag1, PowerTag2);	// Reads the values of the power received from each tag"
					Tag0.SetMaxPower(PowerTag0);							// Sets max power for all tags as the one read from tag0
				    Tag1.SetMaxPower(PowerTag1);
				    Tag2.SetMaxPower(PowerTag2);
				    ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt"); 
					if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						exit(1);
					}
				    Acknowledge(ConfirmFile,"CAL");
				    ConfirmFile.close();
				    //***BORRAR
				    cout<<"Max Power of Tag0: " << Tag0.GetMaxPower() << ". Tag1: " << Tag1.GetMaxPower() << ". Tag2: " << Tag2.GetMaxPower() << endl;
				    //***BORRAR
				break;
			case 'G': ReadPower(USBport, PowerTag0, PowerTag1, PowerTag2);	// Reads the values of the power received from each tag
					Tag1.SetMaxDistance(PowerTag1);
					Tag2.SetMaxDistance(PowerTag2);
				    Grid.SetAreaGrid(CELLSIZE, Tag1.GetMaxDistance(), Tag2.GetMaxDistance());	// Define the size of the room
				    XaxisPartitions = Grid.GetXaxisLength();				// Get the unit partitions for the grid
				    YaxisPartitions = Grid.GetYaxisLength();
				    ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt");
				    if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						//exit(1);
					}
				    Acknowledge(ConfirmFile,"GRI");
				    ConfirmFile.close();
				    //***BORRAR
				    cout << "Maxpower Tag0: " << Tag0.GetMaxPower() << ". Tag1: " << Tag1.GetMaxPower() << ". Tag2: " << Tag2.GetMaxPower() << endl;
				    cout << "MaxDistance Tag0: " << Tag0.GetMaxDistance() << ". Tag1: " << Tag1.GetMaxDistance() << ". Tag2: " << Tag2.GetMaxDistance() << endl;
				    cout << " Grid partitions in X: " << XaxisPartitions << " and Y: " << YaxisPartitions << endl;
				    //***BORRAR
				break;
			case 'P': 
					ReadPower(USBport, PowerTag0, PowerTag1, PowerTag2);	// Reads the values of the power received from each tag
					Tag0.SetCurrentDistance(PowerTag0);
					Tag1.SetCurrentDistance(PowerTag1);
					Tag2.SetCurrentDistance(PowerTag2);
					Receiver.SetCornerDistances(Tag1.GetMaxDistance(), Tag2.GetMaxDistance());
				    X_coordinate = Receiver.GetXcoordinate(Tag0.GetCurrentDistance(), Tag2.GetCurrentDistance());
				    Y_coordinate = Receiver.GetYcoordinate(Tag0.GetCurrentDistance(), Tag1.GetCurrentDistance());
				    DataOutFile.open("/home/pi/Desktop/Parsing/DATA.txt"); 
					if (DataOutFile.fail())
					{
						cout << "Error opening Data File" << endl;
						exit(1);
					}
				    Transmit(DataOutFile, XaxisPartitions, YaxisPartitions, X_coordinate, Y_coordinate);
				    DataOutFile.close();
				    ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt");
				    if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						exit(1);
					}
				    Acknowledge(ConfirmFile,"POS");
				    ConfirmFile.close();
				    //***BORRAR
				    cout << "Current Distance to Tag0: " << Tag0.GetCurrentDistance() << ". Tag1: " << Tag1.GetCurrentDistance() << ". Tag2: " << Tag2.GetCurrentDistance() << endl;
					cout << "Grid size in units. X axis: " << XaxisPartitions << ". Y axis: " << YaxisPartitions << endl;
				    cout << "Current position. X: " << X_coordinate << ". Y: " << Y_coordinate << endl;
				    //***BORRAR
				break;
			case 'H': ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt");
					if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						exit(1);
					}
				    Acknowledge(ConfirmFile,"HOL");
				    ConfirmFile.close();
				    usleep(5000);
				break;
			case 'Q': ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt");
					if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						//exit(1);
					}
				    Acknowledge(ConfirmFile,"QUI");
				    ConfirmFile.close();
					Q=false;
				break;
			default: ConfirmFile.open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt");
					if (ConfirmFile.fail())
					{
						cout << "Error opening ACKNOWLEDGE. txt fille" << endl;
						//exit(1);
					}
				    Acknowledge(ConfirmFile,"ERROR");
				    ConfirmFile.close();
					Q=false;
		}
			

		//USBport.close();
		CommFile.close();
		i++;
	}
	return 0;
}

// Returns the comand that was last received with Unix time information
void Acknowledge(ofstream& ComFile, string Word)				
{
	int CurrentTime;
	CurrentTime = time(nullptr);
	ComFile << Word << " " << CurrentTime << endl;
	
}

void Transmit(ofstream& Data, int X_Grid_value, int Y_Grid_value, int X_value, int Y_value)	// Transmit the values of the grid size and the coordinates
{
	Data << X_Grid_value << " " << Y_Grid_value << " " << X_value<< " " << Y_value << endl;
}


void ReadPower(ifstream& Port, double& Tag0, double& Tag1, double& Tag2)
{
	char InputData[25];											// Receives the raw data from the RFID reader
	char A, a;
	int i=0;													// Index to read the Input Data
	bool Zero = false, One = false, Two = false;				// Flags to indicate if tags 0, 1 or 2 have been read
	double Tag0Temp = 0, Tag1Temp = 0, Tag2Temp = 0;			// To calculate the average values red on the port
	int AvTag0 = 0, AvTag1 = 0, AvTag2 = 0;
	Port.open("/dev/ttyUSB0");							// Opens the port for data
	if (Port.fail()) 
	{
		cout <<"Error opening /dev/ttyUSB0" << endl;	
		exit(1);
	}
	for (i = 0; i<3; i++)
	{	
	while(!(Zero && One && Two))								// Loop is going to go untill all three tags are read
	{
		Port >> InputData;
					
		switch (InputData[15])
		{
			case TAG0NUMBER: Tag0Temp = Tag0Temp + (AsciiToDouble(InputData[17])*10)+AsciiToDouble(InputData[18]);
					 Zero = true;
					 AvTag0++;
					//***BORRAR
					//cout << "Tag0Temp Power read: " << Tag0Temp << endl << endl;
					//***BORRAR
					break;
			case TAG1NUMBER: Tag1Temp = Tag1Temp + (AsciiToDouble(InputData[17])*10)+AsciiToDouble(InputData[18]);
					 One = true;
					 AvTag1++;
					break;
			case TAG2NUMBER: Tag2Temp = Tag2Temp + (AsciiToDouble(InputData[17])*10)+AsciiToDouble(InputData[18]);
					 Two = true;
					 AvTag2++;
					break;
		}
	}
	Zero = One = Two = false;
	}
	Tag0 = Tag0Temp/AvTag0;
	Tag1 = Tag1Temp/AvTag1;
	Tag2 = Tag2Temp/AvTag2;
	//***BORRAR
	cout << "Power of Tag0: " << Tag0 << " Tag1: " << Tag1 << " Tag2: " << Tag2 << endl;
	//***BORRAR
	Port.close();
}

//This function converts a character into a double number, checking for validity
double AsciiToDouble (char Number)
{
	switch (Number)
	{
		case '0': return 0;
			break;
		case '1': return 1;
			break;
		case '2': return 2;
			break;
		case '3': return 3;
			break;
		case '4': return 4;
			break;
		case '5': return 5;
			break;
		case '6': return 6;
			break;
		case '7': return 7;
			break;
		case '8': return 8;
			break;
		case '9': return 9;
			break;
		default: return 0;
	}
}

