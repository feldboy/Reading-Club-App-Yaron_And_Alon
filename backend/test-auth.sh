#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"

echo -e "${YELLOW}🧪 Testing Reading Club Authentication API${NC}\n"

# Test 1: Register a new user
echo -e "${YELLOW}1️⃣  Testing User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"yarontest","email":"yaron@test.com","password":"test12345"}')

echo "$REGISTER_RESPONSE" | jq .

# Extract tokens
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.refreshToken')

if [ "$ACCESS_TOKEN" != "null" ]; then
  echo -e "${GREEN}✅ Registration successful!${NC}\n"
else
  echo -e "${RED}❌ Registration failed${NC}\n"
  exit 1
fi

# Test 2: Login with the same user
echo -e "${YELLOW}2️⃣  Testing User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"yaron@test.com","password":"test12345"}')

echo "$LOGIN_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

if [ "$NEW_ACCESS_TOKEN" != "null" ]; then
  echo -e "${GREEN}✅ Login successful!${NC}\n"
  ACCESS_TOKEN="$NEW_ACCESS_TOKEN"
else
  echo -e "${RED}❌ Login failed${NC}\n"
  exit 1
fi

# Test 3: Access protected route (logout requires auth)
echo -e "${YELLOW}3️⃣  Testing Protected Route (Logout)${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST $API_URL/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$LOGOUT_RESPONSE" | jq .

if echo "$LOGOUT_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
  echo -e "${GREEN}✅ Protected route works!${NC}\n"
else
  echo -e "${RED}❌ Protected route failed${NC}\n"
  exit 1
fi

# Test 4: Refresh access token
echo -e "${YELLOW}4️⃣  Testing Token Refresh${NC}"
REFRESH_RESPONSE=$(curl -s -X POST $API_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq .

NEW_ACCESS=$(echo "$REFRESH_RESPONSE" | jq -r '.data.accessToken')

if [ "$NEW_ACCESS" != "null" ]; then
  echo -e "${GREEN}✅ Token refresh successful!${NC}\n"
else
  echo -e "${RED}❌ Token refresh failed${NC}\n"
  exit 1
fi

# Test 5: Test unauthorized access
echo -e "${YELLOW}5️⃣  Testing Unauthorized Access${NC}"
UNAUTH_RESPONSE=$(curl -s -X POST $API_URL/auth/logout)

echo "$UNAUTH_RESPONSE" | jq .

if echo "$UNAUTH_RESPONSE" | jq -e '.status == "error"' > /dev/null; then
  echo -e "${GREEN}✅ Unauthorized access blocked correctly!${NC}\n"
else
  echo -e "${RED}❌ Unauthorized access test failed${NC}\n"
fi

echo -e "${GREEN}🎉 All authentication tests passed!${NC}"
