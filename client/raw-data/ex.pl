#!/usr/bin/env perl

use strict;
use File::Copy;
use Data::Dumper;
use JSON;

sub trim($) {
	my $string = shift;
	$string =~ s/^\s+//;
	$string =~ s/\s+$//;
	return $string;
}

sub trimPath($) {
	my $string = shift;
	$string =~ s/$ENV{'HOME'}\/gbn\///;
	return $string;
}

sub getName($) {
	my $str = shift;
	$str =~ s/-/ /g;
	return $str;
}

my $inputPath = "/home/subho/gbn/raw-data/geetabitan.com/lyrics/";
my $outputPath = "/home/subho/gbn/raw-data/lyrics/";
my $notOutPath =  "/home/subho/gbn/raw-data/notation/";
my $notInPath = "/home/subho/gbn/raw-data/geetabitan.com/notation/notimg/";

my @alpha = 'A'..'Z';
my @manifest = ();

foreach (@alpha) {
	my $curNotOutPath = $notOutPath.$_."/";
	my $curOutPath = $outputPath.$_."/";
	my @files = glob($inputPath.$_."/*");
	@files = grep { $_!~/midi$/ and $_!~/pdf$/ and $_!~/song-list.html$/ and $_!~/css$/} @files;
	foreach (@files) {
		open FIN ,'<', $_;
		$_ =~ /([a-zA-Z\-0-9]+)\.html$/;
		open FOUT,'>', "$curOutPath$1.txt";
		copy($notInPath.$1.".gif", $curNotOutPath.$1.".gif");
		my $hash;
		$hash->{'name'} = trim(getName($1));
		$hash->{'lyrics'} = trimPath("$curOutPath$1.txt");
		$hash->{'notation'} = trimPath($curNotOutPath.$1.".gif"); 
		my $flag = 0;
		my $flag2 = 0;
		my $text = "";
		my $txt = "";
		while(<FIN>) {
			$_ =~ /\<\/pre>/ and $flag=0;
			$flag==1 and $text = $text."\n".$_; 
			$_ =~ /\<pre style/ and	$flag=1;
			
			$_ =~ /\<\/div>/ and $flag2=0;
			$flag2==1 and $txt = $txt."\n".$_; 
			$_ =~ /\<div id="faq2"/ and	$flag2=1;
		}
		$txt =~ /Parjaay : ([a-zA-Z\-\/0-9\s]+)/ and $hash->{'parjaay'} = trim($1);
		$txt =~ /Taal : ([a-zA-Z\-\/0-9\s]+)\n?/ and $hash->{'taal'} = trim($1);
		$txt =~ /Raag : ([a-zA-Z\-\/0-9\s]+)\n?/ and $hash->{'raag'} = trim($1);
		$txt =~ /Written on : ([0-9]+)/ and $hash->{'date'} = trim($1);
		push @manifest, $hash;
		print FOUT $text;
		close FIN;
		close FOUT;
	}
}

my $json = encode_json \@manifest;
open MAN,'>', "manifest.json";
print MAN $json;
close MAN;
