using System;
using System.IO;

namespace Generator;

public class Program
{

    public static void Main(string[] args)
    {
        CreateRandomImage("testFile",1280,720);
    }

    public static void CreateRandomImage(string filename, int width, int height)
    {

        string fileName = "./" + filename + ".bmp";
        //Size of pixel array
        int pixelArraySize = width * height * 4;

        byte[] bytePixelHeight = BitConverter.GetBytes(height);
        byte[] bytePixelWidth = BitConverter.GetBytes(width);
        byte[] bytePixelArea = BitConverter.GetBytes(pixelArraySize);

        //Size of the file in bytes
        int fileSize = 122 + pixelArraySize;

        // Creates random data to write to the file.
        byte[] dataArray = new byte[pixelArraySize];
        new Random().NextBytes(dataArray);

        //This using statement makes a stream writer for files specifically. 
        //It differs from a StreamWriter by limiting the stream to a scope so it's discarded once this block is exited.
        using (FileStream
            fileStream = new FileStream(fileName, FileMode.Create, FileAccess.ReadWrite))
        {
            //The code below writes the header to the file
            Byte[] headerArray = {
                //Code for BMP file types
                0x42,0x4D,
                //File size (BMP Header + DIB Header + Pixels size)
                bytePixelArea[0],bytePixelArea[1],bytePixelArea[2],bytePixelArea[3],
                //Filler bits
                0x00,0x00,
                //Filler bits
                0x00,0x00,
                //Location of the pixel array
                0x7A,0x00,0x00,0x00
                };

            for(int i = 0; i < headerArray.Length; i++)
            {
                fileStream.WriteByte(headerArray[i]);
            }//14 bytes

            //DIB Header
            Byte[] dibArray = {
                //Number of bytes in this header only (doesn't include BMP Header)
                0x6C,0x00,0x00,0x00,
                //Width of pixels
                bytePixelWidth[0],bytePixelWidth[1],bytePixelWidth[2],bytePixelWidth[3],
                //Height of pixels
                bytePixelHeight[0],bytePixelHeight[1],bytePixelHeight[2],bytePixelHeight[3],
                //Number of color planes
                0x01,0x00,
                //Number of bits per pixel
                0x20,0x00,
                //BI_BITFIELDS???
                0x03,0x00,0x00,0x00,
                //Size of the raw bitmap data (with padding)
                0x20,0x00,0x00,0x00,
                //Print resolution of the image
                0x13,0x0B,0x00,0x00,
                0x13,0x0B,0x00,0x00,
                //Number of colors in the pallete
                0x00,0x00,0x00,0x00,
                //Number of important colors
                0x00,0x00,0x00,0x00,
                //Red channel bit mask
                0x00,0x00,0xFF,0x00,
                //Green channel bit mask
                0x00,0xFF,0x00,0x00,
                //Blue channel bit mask
                0xFF,0x00,0x00,0x00,
                //Alpha channel bit mask
                0x00,0x00,0x00,0xFF,
                //LCS_WINDOWS_COLOR_SPACE
                0x20,0x6E,0x69,0x57,
                //Unused for LCS "Win" or "sRGB"
                0x00,0x00,0x00,0x00,0x00,0x00,
                0x00,0x00,0x00,0x00,0x00,0x00,
                0x00,0x00,0x00,0x00,0x00,0x00,
                0x00,0x00,0x00,0x00,0x00,0x00,
                0x00,0x00,0x00,0x00,0x00,0x00,
                0x00,0x00,0x00,0x00,0x00,0x00,
                //Unused for LCS Red Gamma
                0x00,0x00,0x00,0x00,
                //Unused for LCS green Gamma
                0x00,0x00,0x00,0x00,
                //Unused for LCS blue Gamma
                0x00,0x00,0x00,0x00
            };//96 bytes

            for(int i = 0; i < dibArray.Length; i++)
            {
                fileStream.WriteByte(dibArray[i]);
            }

            Byte[] pixelArray = {
                0xff,0x00,0x00,0x7f,
                0x00,0xff,0x00,0x7f,
                0x00,0x00,0xff,0x7f,
                0xff,0xff,0xff,0x7f,
                0xff,0x00,0x00,0xff,
                0x00,0xff,0x00,0xff,
                0x00,0x00,0xff,0xff,
                0xff,0xff,0xff,0xff
            };

            for(int i = 0; i < dataArray.Length; i++)
            {
                fileStream.WriteByte(dataArray[i]);
            }

            fileStream.Flush();
        }
    }
}