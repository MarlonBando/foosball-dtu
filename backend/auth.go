package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"math/big"
	"strings"
)

type JWK struct {
	Kty string `json:"kty"`
	Crv string `json:"crv"`
	X   string `json:"x"`
	Y   string `json:"y"`
	Alg string `json:"alg"`
	Kid string `json:"kid"`
}

var PUBLIC_KEY ecdsa.PublicKey

func ParseJWK(keyContent string) error {
	var jwk JWK
	if err := json.Unmarshal([]byte(keyContent), &jwk); err != nil {
		return err
	}

	if jwk.Crv != "P-256" {
		return errors.New("Unsupported curve")
	}

	xBytes, err := base64.RawURLEncoding.DecodeString(jwk.X)
	if err != nil {
		return err
	}

	yBytes, err := base64.RawURLEncoding.DecodeString(jwk.Y)
	if err != nil {
		return err
	}

	x := new(big.Int).SetBytes(xBytes)
	y := new(big.Int).SetBytes(yBytes)

	pubKey := ecdsa.PublicKey{
		Curve: elliptic.P256(),
		X:     x,
		Y:     y,
	}

	PUBLIC_KEY = pubKey
	return nil
}

func IsTokenValid(tokenString string) bool {
	// Check the algorithm and if it's the one it returns the public key
	// It's required by jwt.Parse
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return &PUBLIC_KEY, nil
	}

	// Parse and verify the token
	_, err := jwt.Parse(tokenString, keyFunc)
	if err != nil {
		return false
	}

	// TODO: Verify expiration date
	// TODO: Verify issuer
	// TODO: Not before
	return true
}

func GetUserIDFromToken(tokenString string) (string, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return &PUBLIC_KEY, nil
	}

	token, err := jwt.Parse(tokenString, keyFunc)
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", errors.New("invalid token claims")
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("user_id not found in token")
	}

	return userID, nil
}

func Auth(authHeader string) error {
	if authHeader == "" {
		return errors.New("missing authorization token")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return errors.New("authorization header is badly formatted, should be 'Bearer <token>'")
	}

	token := parts[1]

	// Replace IsTokenValid with your actual validation function
	if !IsTokenValid(token) {
		return errors.New("token not valid")
	}

	return nil
}
